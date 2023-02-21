import React, {ReactElement} from "react";

type s_digit =  '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'.';
type s_number = string;
type s_var = string;
type int = number;

function cast<U, T = any>(value: T) : U {
    return value as unknown as U;
}
function log<T>(value: T) : T {
    console.log(value);
    return value;
}

function Text({children: text} : {children:string}){
    return <span className='text'>{text}</span>
}

function Digit({digit} : {digit: s_digit}){
    return <span className="digit">{digit}</span>
}

function Var({letter, italic=true} : {letter: string, italic?: boolean}){
    return italic ? <var>{letter}</var> : <var data-noitalic="">{letter}</var>;
}

function BinOp({text} : {text: string}){
    return <span className="operator">{text}</span>
}

function NumberEl(
    {value, cursor} :
    {value : s_number, cursor: int}
){
    let children = value.split('').map(
        (s, i) => <Digit digit={s as s_digit} key={i}/>
    )
    if(cursor !== -1) {
        children.splice(cursor, 0, <span className="cursor" key="cursor"/>)
    }

    return <span className="number">{children}</span>
}

function Fraction({numerator, denominator}:{numerator: ReactElement[], denominator: ReactElement[]}) {
    return <span className="fraction">
        <span className="numerator">{numerator}</span>
        <span className="denominator">{denominator}</span>
        <span>&#x200B;</span>
    </span>
}

function Grouping({left, right, children} : {left: string, right:string, children: ReactElement[]}){
    return <div className="grouping" data-left={left} data-right={right}>{children}</div>
}

type Sym = () => ReactElement;
type UnaryCommand = (a: ReactElement[]) => ReactElement;
type BinaryCommand = (a: ReactElement[], b: ReactElement[]) => ReactElement;

const COMMANDS = new class {
    private symbols : Map<string, Sym> = new Map();
    private unaryCommands: Map<string, UnaryCommand> = new Map();
    private binaryCommands: Map<string, BinaryCommand> = new Map();
    addSymbol(name: string, func: Sym){
        this.symbols.set(name, func);
    }
    addLetter(name: string, sym: s_var, italic=true){
        this.symbols.set(name, () => <Var letter={sym} italic={italic}/>)
    }
    addUnaryCommand(name: string, func: UnaryCommand){
        this.unaryCommands.set(name, func);
    }
    addBinaryCommand(name: string, func: BinaryCommand){
        this.binaryCommands.set(name, func);
    }

    hasSymbol(name: string){
        return this.symbols.has(name);
    }

    hasUnaryCommand(name: string) {
        return this.unaryCommands.has(name);
    }
    hasBinaryCommand(name: string) {
        return this.binaryCommands.has(name);
    }

    getSymbol(name: string) {
        return cast<Sym>(this.symbols.get(name))();
    }
    applyUnaryCommand(name: string, a: ReactElement[]) {
        return cast<UnaryCommand>(this.unaryCommands.get(name))(a);
    }
    applyBinaryCommand(name: string, a: ReactElement[], b: ReactElement[]) {
        return cast<BinaryCommand>(this.binaryCommands.get(name))(a, b);
    }
}();

COMMANDS.addLetter('alpha', 'α');
COMMANDS.addLetter('beta', 'β');
COMMANDS.addLetter('Gamma', 'Γ', false);
COMMANDS.addLetter('gamma', 'γ');
COMMANDS.addLetter('Delta', 'Δ', false);
COMMANDS.addLetter('delta', 'δ');
COMMANDS.addLetter('nabla', '∇', false);
COMMANDS.addLetter('del', '∂');
COMMANDS.addLetter('epsilon', 'ϵ');
COMMANDS.addLetter('zeta', 'ζ');
COMMANDS.addLetter('eta', 'η');
COMMANDS.addLetter('Theta', 'Θ', false);
COMMANDS.addLetter('theta', 'θ');
COMMANDS.addLetter('iota', 'ι');
COMMANDS.addLetter('kappa', 'κ');
COMMANDS.addLetter('Lambda', 'Λ', false);
COMMANDS.addLetter('lambda', 'λ');
COMMANDS.addLetter('mu', 'μ');
COMMANDS.addLetter('nu', 'ν');
COMMANDS.addLetter('Xi', 'Ξ', false);
COMMANDS.addLetter('xi', 'ξ');
COMMANDS.addLetter('Pi', 'Π', false);
COMMANDS.addLetter('pi', 'π');
COMMANDS.addLetter('rho', 'ρ');
COMMANDS.addLetter('Sigma', 'Σ', false);
COMMANDS.addLetter('sigma', 'σ');
COMMANDS.addLetter('tau', 'τ');
COMMANDS.addLetter('Phi', 'Φ', false);
COMMANDS.addLetter('phi', 'ϕ');
COMMANDS.addLetter('chi', 'χ');
COMMANDS.addLetter('Psi', 'Ψ', false);
COMMANDS.addLetter('psi', 'ψ');
COMMANDS.addLetter('Omega', 'Ω', false);
COMMANDS.addLetter('omega', 'ω')
COMMANDS.addSymbol('times', () => <BinOp text='·'/>)
COMMANDS.addSymbol('divide', () => <BinOp text='÷'/>)
COMMANDS.addSymbol('plus', () => <BinOp text='+'/>)
COMMANDS.addSymbol('minus', () => <BinOp text='-'/>)
COMMANDS.addSymbol('pm', () => <BinOp text='±'/>)
COMMANDS.addSymbol('mp', () => <BinOp text='∓'/>)
COMMANDS.addSymbol('cross', () => <BinOp text='⨯'/>)
COMMANDS.addSymbol('lt', () => <BinOp text='<'/>)
COMMANDS.addSymbol('gt', () => <BinOp text='>'/>)
COMMANDS.addSymbol('eq', () => <BinOp text='='/>)
COMMANDS.addSymbol('le', () => <BinOp text='≤'/>)
COMMANDS.addSymbol('ge', () => <BinOp text='≥'/>)
COMMANDS.addSymbol('ne', () => <BinOp text='!='/>)
COMMANDS.addBinaryCommand('frac', (a, b) => <Fraction numerator={a} denominator={b}/>)
COMMANDS.addUnaryCommand('sup', a => <sup>{a}</sup>)
COMMANDS.addUnaryCommand('sub', a=><sub>{a}</sub>)
COMMANDS.addUnaryCommand('arr', a => <Grouping left='[' right=']'>{a}</Grouping>)
COMMANDS.addUnaryCommand('paren', a => <Grouping left='(' right=')'>{a}</Grouping>)
COMMANDS.addUnaryCommand('set', a => <Grouping left='{' right='}'>{a}</Grouping>)

type _it = { readonly next : string, advance : () => void, readonly done : boolean };
class MathParser {
    public static parse(code: String): ReactElement[]{
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
            it.advance(); // Skip over the closing '}'
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
        if(it.next.match(/[\d.-]/)) {
            let dPoint = false;
            let n = '';
            if(it.next === '-') {
                n += '–';
                it.advance();
            }
            while(!it.done && (it.next.match(/\d/) || (it.next === '.' && !dPoint))) {
                if(it.next === '.') dPoint = true;
                n += it.next;
                it.advance();
            }
            log('parsed number: ' + n);
            return <NumberEl value={n} cursor={-1}/>;
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
            else return <></>   // (-_-) sad
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

    }
}

// @ts-ignore
window.MathParser = MathParser;

export function MathRenderer({code} : {code: string}) {
    return <div className="math">
        {MathParser.parse(code)}
    </div>
}

/*
 * Example code:
 * 3.14159 a \times 180 + \frac { r \theta } { 2 \times x}
 */