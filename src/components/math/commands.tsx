import React, {ReactElement} from "react";
import {BinOp, Fraction, Grouping, MinusSign, Var} from "./components";
import {cast} from "../../util/util";

type Sym = () => ReactElement;
type UnaryCommand = (a: ReactElement[]) => ReactElement;
type BinaryCommand = (a: ReactElement[], b: ReactElement[]) => ReactElement;

export const COMMANDS = new class {
    private symbols : Map<string, Sym> = new Map();
    private unaryCommands: Map<string, UnaryCommand> = new Map();
    private binaryCommands: Map<string, BinaryCommand> = new Map();
    addSymbol(name: string, func: Sym){
        this.symbols.set(name, func);
    }
    addLetter(name: string, sym: string, italic=true){
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

COMMANDS.addSymbol('comma', () => <span className="comma">,</span>)

COMMANDS.addSymbol('times', () => <BinOp text='·'/>)
COMMANDS.addSymbol('divide', () => <BinOp text='÷'/>)
COMMANDS.addSymbol('plus', () => <BinOp text='+'/>)
COMMANDS.addSymbol('minus', () => <MinusSign/>)
COMMANDS.addSymbol('pm', () => <BinOp text='±'/>)
COMMANDS.addSymbol('mp', () => <BinOp text='∓'/>)
COMMANDS.addSymbol('cross', () => <BinOp text='⨯'/>)
COMMANDS.addSymbol('etc', () => <BinOp text='...'/>)

COMMANDS.addSymbol('lt', () => <BinOp text='<'/>)
COMMANDS.addSymbol('gt', () => <BinOp text='>'/>)
COMMANDS.addSymbol('eq', () => <BinOp text='='/>)
COMMANDS.addSymbol('le', () => <BinOp text='≤'/>)
COMMANDS.addSymbol('ge', () => <BinOp text='≥'/>)
COMMANDS.addSymbol('ne', () => <BinOp text='≠'/>)
COMMANDS.addSymbol('ae', () => <BinOp text='≈'/>)

COMMANDS.addUnaryCommand('sup', a => <sup>{a}</sup>)
COMMANDS.addUnaryCommand('sub', a=><sub>{a}</sub>)

COMMANDS.addUnaryCommand('arr', a => <Grouping svg={(ref, side) =>
    <svg preserveAspectRatio="none" viewBox="0 0 11 24" className={`${side} group-symbol`} ref={ref}>
        <path d="M8 0 L3 0 L3 24 L8 24 L8 23 L4 23 L4 1 L8 1"></path>
    </svg>
}>{a}</Grouping>)
COMMANDS.addUnaryCommand('paren', a => <Grouping svg={(ref, side) =>
    <svg preserveAspectRatio="none" viewBox = "3 0 106 186" className={`${side} group-symbol`} ref={ref}>
        <path d = "M85 0 A61 101 0 0 0 85 186 L75 186 A75 101 0 0 1 75 0" ></path>
    </svg>
}>{a}</Grouping>)

COMMANDS.addUnaryCommand('int', a => <div><big className="int">∫</big>{a}</div>)

COMMANDS.addBinaryCommand('frac', (a, b) => <Fraction numerator={a} denominator={b}/>)

/*
 * Example code:
 * 3.14159 a \times 180 + \frac { r \theta } { 2 \times x}
 */