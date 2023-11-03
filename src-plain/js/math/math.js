/** @typedef {{readonly next : string, advance : () => void, readonly done : boolean}} _it*/

class MathParser {
    static replacements = [
        [/ ( +)/, '" "'],
        [',', '\\comma '],
        ['\'', '\\prime'],
        ['\\ihat', '\\hat\\i'],
        ['\\jhat', '\\hat\\j'],
        ['\\khat', '\\hat\\k'],
        ['\\rhat', '\\hat\\b\\r'],
        ['===', '\\equiv '],
        [':=', '\\define '],
        ['::', '\\analogous '],
        [':', '\\ratio '],
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
    ]

    static #sanitize(string=''){
        function sanitizeRegexInput(reg){
            return reg.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
        }

        for(const [key, replace] of this.replacements){
            let r = key instanceof RegExp ? key.source : sanitizeRegexInput(key);
            let k = new RegExp('(?<=^[^"]*(?:"[^"]*"[^"]*)*)' + r, 'g');
            string = string.replaceAll(k, replace);
        }
        return string;
    }
    static parse(code=''){
        code = this.#sanitize(code);
        let i = 0;
        return this.#parseMany({
            get next () {return i >= code.length ? null : code[i]},
            advance : () => {i++},
            get done() {return i >= code.length }
        });
    }
    /** @param {_it} it */
    static #parseSingle(it) {
        while(!it.done && it.next === ' ') it.advance();
        // If nothing to parse
        if(it.next == null || it.done || it.next === '}') return null
        // If block to parse
        if(it.next === '{'){
            it.advance();
            let elements = this.#parseMany(it);
            it.advance(); // Skip over the closing brace
            return elements
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
            return TextEl(text)
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
            return NumberEl(n);
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
                return COMMANDS.createSymbol(s);
            }
            else if(COMMANDS.hasUnaryCommand(s)){
                let p1 = this.#parseSingle(it);
                return COMMANDS.applyUnaryCommand(s, [p1]);
            }
            else if(COMMANDS.hasBinaryCommand(s)){
                let p1 = this.#parseSingle(it);
                let p2 = this.#parseSingle(it);
                return COMMANDS.applyBinaryCommand(s, [p1], [p2]);
            }
            else return TextEl(s);
        }
        // If var to parse
        if(it.next.match(/[a-zA-Z]+/)) {
            let s = it.next;
            it.advance();
            log('parsed variable: ' + s)
            return Var(s)
        }

        log('Unknown:' + it.next);
        it.advance();
        return null
    }
    static #parseMany(it) {
        while(!it.done && it.next === ' ') it.advance();

        if(it.done || it.next === '}') return [];
        let el = this.#parseSingle(it);

        return [el, ...this.#parseMany(it)];
    }
}