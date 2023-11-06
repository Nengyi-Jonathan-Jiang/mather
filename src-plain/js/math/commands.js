/**
 * @typedef {() => HTMLElement} Sym
 * @typedef {(a: HTMLElement[]) => HTMLElement} UnaryCommand
 * @typedef {(a: HTMLElement[], b: HTMLElement[]) => HTMLElement} BinaryCommand
 */

class CommandHandler {
    /** @type {Map<string, Sym>} */
    symbols = new Map();
    /** @type {Map<string, UnaryCommand>} */
    unaryCommands = new Map();
    /** @type {Map<string, BinaryCommand>} */
    binaryCommands = new Map();

    /**
     * @param {string} name
     * @param {Sym} func
     */
    addSymbol(name, func) {
        this.symbols.set(name, func);
    }

    /**
     * @param {string} name
     * @param {string} [value]
     */
    addBuiltin(name, value) {
        this.symbols.set(name, () => Span('func', value ?? name))
    }

    /**
     * @param {string} name
     * @param {string} [value]
     */
    addOperator(name, value) {
        this.symbols.set(name, () => BinOp(value ?? name))
    }

    /**
     * @param {string} name
     * @param {string} sym
     * @param {boolean} [italic]
     */
    addLetter(name, sym, italic = true) {
        this.symbols.set(name, () => Var(sym, italic))
    }

    /**
     * @param {string} name
     * @param {UnaryCommand} func
     */
    addUnaryCommand(name, func) {
        this.unaryCommands.set(name, func);
    }

    /**
     * @param {string} name
     * @param {BinaryCommand} func
     */
    addBinaryCommand(name, func) {
        this.binaryCommands.set(name, func);
    }

    /** @param {string} name */
    hasSymbol(name) {
        return this.symbols.has(name);
    }

    /** @param {string} name */
    hasUnaryCommand(name) {
        return this.unaryCommands.has(name);
    }

    /** @param {string} name */
    hasBinaryCommand(name) {
        return this.binaryCommands.has(name);
    }


    /** @param {string} name */
    createSymbol(name) {
        return this.symbols.get(name)();
    }

    /**
     * @param {string} name
     * @param {HTMLElement[]} a
     */
    applyUnaryCommand(name, a) {
        return this.unaryCommands.get(name)(a);
    }

    /**
     * @param {string} name
     * @param {HTMLElement[]} a
     * @param {HTMLElement[]} b
     */
    applyBinaryCommand(name, a, b) {
        return this.binaryCommands.get(name)(a, b);
    }
}

const COMMANDS = new CommandHandler()
const MATH_COMMANDS = new CommandHandler();

COMMANDS.addSymbol('break', () => Span('break'));
COMMANDS.addUnaryCommand('math', a => Div('', a));

COMMANDS.addUnaryCommand('indent', a => Element('span', 'indent', '', a));

{
    const letters = [
        ['alpha', 'α'],
        ['beta', 'β'],
        ['Gamma', 'Γ', false],
        ['gamma', 'γ'],
        ['Delta', 'Δ', false],
        ['delta', 'δ'],
        ['nabla', '∇', false],
        ['del', '∂', false],
        ['epsilon', 'ϵ', false],
        ['zeta', 'ζ', false],
        ['hbar', 'ħ'],
        ['eta', 'η'],
        ['Theta', 'Θ', false],
        ['theta', 'θ'],
        ['i', '𝒊', false],
        ['j', '𝒋', false],
        ['k', '𝒌', false],
        ['iota', 'ι'],
        ['kappa', 'κ'],
        ['Lambda', 'Λ', false],
        ['lambda', 'λ'],
        ['mu', 'μ'],
        ['nu', 'ν'],
        ['Xi', 'Ξ', false],
        ['xi', 'ξ', false],
        ['Pi', 'Π', false],
        ['pi', 'π', false],
        ['rho', 'ρ'],
        ['Sigma', 'Σ', false],
        ['sigma', 'σ'],
        ['tau', 'τ'],
        ['Phi', 'Φ', false],
        ['phi', 'ϕ'],
        ['chi', 'χ'],
        ['Psi', 'Ψ', false],
        ['psi', 'ψ'],
        ['Omega', 'Ω', false],
        ['omega', 'ω'],
    ];
    for(let [name, sym, italic] of letters) {
        COMMANDS.addLetter(name, sym, false)
        MATH_COMMANDS.addLetter(name, sym, italic||true)
    }
}

COMMANDS.addOperator('and', '∧');
COMMANDS.addOperator('or', '∨');
COMMANDS.addLetter('not', '¬', false);
COMMANDS.addOperator('xor', '⊕');
COMMANDS.addLetter('intersection', '⋂', false);
COMMANDS.addLetter('union', '⋃', false);

COMMANDS.addLetter('hamiltonian', 'ℋ', false);
COMMANDS.addLetter('lagrangian', 'ℒ', false);

COMMANDS.addLetter('inf', '∞', false)
COMMANDS.addLetter('aleph', 'ℵ', false)
COMMANDS.addLetter('continuum', '𝖈', false)

COMMANDS.addLetter('all', '∀', false);
COMMANDS.addLetter('exist', '∃', false);

COMMANDS.addLetter('re', 'ℜ', false);
COMMANDS.addLetter('imag', 'ℑ', false);

COMMANDS.addLetter('reals', 'ℝ', false);
COMMANDS.addLetter('naturals', 'ℕ', false);
COMMANDS.addLetter('integers', 'ℤ', false);
COMMANDS.addLetter('complexes', 'ℂ', false);
COMMANDS.addLetter('rationals', 'ℚ', false);
COMMANDS.addLetter('quaternions', 'ℍ', false);

COMMANDS.addSymbol('comma', () => Span('separator', ','));
COMMANDS.addSymbol('colon', () => Span('separator', ':'));
COMMANDS.addSymbol('semicolon', () => Span('separator', ';'));

COMMANDS.addLetter('fact', '!', false);

COMMANDS.addOperator('times', '·')
COMMANDS.addOperator('divide', '÷')
COMMANDS.addOperator('plus', '+')
COMMANDS.addOperator('minus', '−')
COMMANDS.addOperator('pm', '±')
COMMANDS.addOperator('mp', '∓')
COMMANDS.addOperator('cross', '×')
COMMANDS.addOperator('hdots', '⋯')
COMMANDS.addOperator('vdots', '⋮')
COMMANDS.addOperator('ratio', ':');
COMMANDS.addOperator('analogous', '∷');

COMMANDS.addOperator('mod');
COMMANDS.addOperator('in', '∊');
COMMANDS.addOperator('incl', '∍');
COMMANDS.addOperator('prop', '∝');

COMMANDS.addOperator('to', '→');
COMMANDS.addOperator('iff', 'iff');
COMMANDS.addOperator('etc', 'etc.');
COMMANDS.addOperator('implies', '⇒');
COMMANDS.addOperator('bimplies', '⇔');
COMMANDS.addOperator('therefore', '∴');
COMMANDS.addOperator('st', 's.t.');
COMMANDS.addOperator('define', '≔')
COMMANDS.addOperator('equiv', '≡')

COMMANDS.addOperator('lt', '<')
COMMANDS.addOperator('gt', '>')
COMMANDS.addOperator('mgt', '≫')
COMMANDS.addOperator('mlt', '≪')
COMMANDS.addOperator('eq', '=')
COMMANDS.addOperator('le', '≤')
COMMANDS.addOperator('ge', '≥')
COMMANDS.addOperator('ne', '≠')
COMMANDS.addOperator('ae', '≈')

COMMANDS.addBuiltin('sin');
COMMANDS.addBuiltin('cos');
COMMANDS.addBuiltin('tan');
COMMANDS.addBuiltin('sec');
COMMANDS.addBuiltin('csc');
COMMANDS.addBuiltin('cot')
COMMANDS.addBuiltin('asin');
COMMANDS.addBuiltin('acos');
COMMANDS.addBuiltin('atan');
COMMANDS.addBuiltin('sinh');
COMMANDS.addBuiltin('cosh');
COMMANDS.addBuiltin('tanh');
COMMANDS.addBuiltin('asinh');
COMMANDS.addBuiltin('acosh');
COMMANDS.addBuiltin('atanh');

COMMANDS.addBuiltin('ln');
COMMANDS.addBuiltin('log');

COMMANDS.addSymbol('prime', () => TextEl('\''));
COMMANDS.addSymbol('conj', () => TextEl('*'));
COMMANDS.addSymbol('dagger', () => TextEl('†'));

COMMANDS.addUnaryCommand('b', a => Span('bold', '', a))
COMMANDS.addUnaryCommand('it', a => Span('italic', '', a))
COMMANDS.addUnaryCommand('heading', a => Span('heading-1', '', a))
COMMANDS.addUnaryCommand('hheading', a => Span('heading-2', '', a))
COMMANDS.addUnaryCommand('hhheading', a => Span('heading-3', '', a))

COMMANDS.addUnaryCommand('arr', a => Grouping(() => SVG("3 0 5 24", '', "M8 0 L3 0 L3 24 L8 24 L8 23 L4 23 L4 1 L8 1"), a, .25))
COMMANDS.addUnaryCommand('abs', a => Grouping(() => SVG("0 0 3 24", '', "M1 0 L2 0 2 24 1 24"), a, .15))
COMMANDS.addUnaryCommand('norm', a => Grouping(() => SVG("0 0 7 24", '', "M1 0 L2 0 2 24 1 24 M5 0 L6 0 6 24 5 24"), a, .3))

COMMANDS.addUnaryCommand('angle', a => Grouping(() => SVG("0 0 8 24", '', "M8 0 L6 0 0 12 6 24 8 24 2 12"), a, .2))
COMMANDS.addUnaryCommand('paren', a => Grouping(() => SVG("28 0 56 187", '', "M85 0 A61 101 0 0 0 85 186 L75 186 A75 101 0 0 1 75 0"), a, .3))
COMMANDS.addUnaryCommand('set', a => Grouping(() => SVG("60 0 115 350", '', "M170 0 L170 6 A47 52 0 0 0 123 60 L123 127 A35 48 0 0 1 88 175 A35 48 0 0 1 123 223 L123 290 A47 52 0 0 0 170 344 L170 350 L160 350 A58 49 0 0 1 102 301 L103 220 A45 40 0 0 0 58 180 L58 170 A45 40 0 0 0 103 130 L103 49 A58 49 0 0 1 161 0"), a, .4))

COMMANDS.addBinaryCommand('dint', Integral)
COMMANDS.addSymbol('int', () => {
    return Div('', [
        Span('int', '∫')
    ])
})
COMMANDS.addBinaryCommand('at', At)

COMMANDS.addUnaryCommand('box', Box)
COMMANDS.addUnaryCommand('sqrt', Sqrt)
COMMANDS.addUnaryCommand('hat', WideHat)
COMMANDS.addUnaryCommand('vec', Vec)
COMMANDS.addUnaryCommand('bar', Bar)

MATH_COMMANDS.addBinaryCommand('frac', Fraction)
COMMANDS.addUnaryCommand('sub', a => SupSub(a, null))
COMMANDS.addUnaryCommand('sup', a => SupSub(null, a))
COMMANDS.addBinaryCommand('supsub', SupSub)
COMMANDS.addBinaryCommand('bsupsub', (a, b) => SupSub(a, b, true))