import {ReactElement} from "react";
import {NumberEl, Text, Var} from "./components";
import {COMMANDS} from './commands'
import {cast, log} from "../util/util";

type _it = { readonly next : string, advance : () => void, readonly done : boolean };
class MathParser {
    private static readonly replacements = [
        [/ ( +)/, '" "'],
        [',', '\\comma '],
        [':', '\\colon '],
        ['...', '\\etc '],
        ['^', '\\sup '],
        ['_', '\\sub '],
        ['+', '\\plus '],
        ['-', '\\minus '],
        ['*', '\\times '],
        ['/', '\\divide '],
        ['>=', '\\ge '],
        ['<=', '\\le '],
        ['>', '\\gt '],
        ['<', '\\lt '],
        ['!=', '\\ne '],
        ['~=', '\\ae'],
        ['=', '\\eq '],
        ['!', '\\fact '],
        ['[', '\\arr{'],
        ['(', '\\paren{'],
        [/[\])]/g, '}'],
    ] as [string|RegExp, string][];

    private static replace(string: String){
        function sanitizeRegexInput(reg : String){
            return reg.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
        }

        for(const [key, replace] of this.replacements){
            let r = key instanceof RegExp ? key.source : sanitizeRegexInput(key);
            let k = new RegExp('(?<=^[^"]*(?:"[^"]*"[^"]*)*)' + r, 'g');
            string = string.replaceAll(k, replace);
        }
        return string;
    }
    public static parse(code: String): ReactElement[]{
        code = this.replace(code);
        let i = 0;
        return this._parseMany({
            get next () {return i >= code.length ? cast<string>(null) : code[i]},
            advance : () => {i++},
            get done() {return i >= code.length }
        });
    }
    private static _parseSingle(it: _it) : ReactElement {
        while(!it.done && it.next === ' ') it.advance();
        // If nothing to parse
        if(it.next == null || it.done || it.next === '}') return <></>
        // If block to parse
        if(it.next === '{'){
            it.advance();
            let elements = this._parseMany(it);
            it.advance(); // Skip over the closing brace
            return <>{elements}</>
        }
        // If string to parse
        if(it.next === '"') {
            it.advance();
            let text = '';
            let escape = false;
            while(!it.done && (escape || it.next !== '"')){
                // @ts-ignore
                escape = !escape && it.next === '\\';
                text += it.next;
                it.advance();
            }
            it.advance();
            return <Text>{text}</Text>
        }
        // If number to parse
        if(it.next.match(/[\d.]/)) {
            let dPoint = false;
            let n = '';
            while(!it.done && (it.next.match(/\d/) || (it.next === '.' && !dPoint))) {
                if(it.next === '.') dPoint = true;
                n += it.next;
                it.advance();
            }
            log('parsed number: ' + n);
            return <NumberEl value={n}/>;
        }
        // If command to parse
        if(it.next === '\\'){
            it.advance();
            let s = '';
            while(!it.done && it.next.match(/^[a-zA-Z]$/)) {
                s += it.next;
                it.advance();
            }
            if(COMMANDS.hasSymbol(s)){
                return COMMANDS.getSymbol(s);
            }
            else if(COMMANDS.hasUnaryCommand(s)){
                let p1 = this._parseSingle(it);
                return COMMANDS.applyUnaryCommand(s, [p1]);
            }
            else if(COMMANDS.hasBinaryCommand(s)){
                let p1 = this._parseSingle(it);
                let p2 = this._parseSingle(it);
                return COMMANDS.applyBinaryCommand(s, [p1], [p2]);
            }
            else return <Text>{s}</Text>   // (-_-) sad
        }
        // If var to parse
        if(it.next.match(/[a-zA-Z]+/)) {
            let s = it.next;
            it.advance();
            log('parsed variable: ' + s)
            return <Var letter={s}></Var>
        }

        log('Unknown:' + it.next);
        it.advance();
        return <></>    // We don't know what to parse
    }
    private static _parseMany(it: _it) : ReactElement[] {
        while(!it.done && it.next === ' ') it.advance();

        if(it.done || it.next === '}') return [];
        let el = this._parseSingle(it);

        return [el, ...this._parseMany(it)];
    }

    public static export(data: any) {
        // TODO
        console.log(data);
    }
}

// @ts-ignore
window.MathParser = MathParser;

export function MathRenderer({code} : {code: string}) {
    return <div className="math">
        {MathParser.parse(code)}
    </div>
}