/**
 * @typedef {() => HTMLElement} Sym
 * @typedef {(a: HTMLElement[]) => HTMLElement} UnaryCommand
 * @typedef {(a: HTMLElement[], b: HTMLElement[]) => HTMLElement} BinaryCommand
 */

const COMMANDS = new class {
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
}()

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
COMMANDS.addLetter('hbar', 'ħ');
COMMANDS.addLetter('eta', 'η');
COMMANDS.addLetter('Theta', 'Θ', false);
COMMANDS.addLetter('theta', 'θ');
COMMANDS.addLetter('i', '𝒊', false);
COMMANDS.addLetter('j', '𝒋', false);
COMMANDS.addLetter('k', '𝒌', false);
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

COMMANDS.addLetter('all', '∀', false);
COMMANDS.addLetter('exist', '∃', false);

COMMANDS.addLetter('re', 'ℜ', false);
COMMANDS.addLetter('imag', 'ℑ', false);

COMMANDS.addLetter('reals', 'ℝ', false);
COMMANDS.addLetter('naturals', 'ℕ', false);
COMMANDS.addLetter('integers', 'ℤ', false);
COMMANDS.addLetter('complexes', 'ℂ', false);
COMMANDS.addLetter('rationals', 'ℚ', false);

COMMANDS.addSymbol('comma', () => Span('separator', ','))
COMMANDS.addSymbol('colon', () => Span('separator', ':'))

COMMANDS.addLetter('fact', '!', false);

COMMANDS.addOperator('times', '·')
COMMANDS.addOperator('divide', '÷')
COMMANDS.addOperator('plus', '+')
COMMANDS.addOperator('minus', '−')
COMMANDS.addOperator('pm', '±')
COMMANDS.addOperator('mp', '∓')
COMMANDS.addOperator('cross', '×')
COMMANDS.addOperator('etc', '...')

COMMANDS.addOperator('mod');
COMMANDS.addOperator('in', '∊');
COMMANDS.addOperator('incl', '∍');
COMMANDS.addOperator('prop', '∝');

COMMANDS.addOperator('to', '→');
COMMANDS.addOperator('iff', 'iff');
COMMANDS.addOperator('etc', 'etc.');
COMMANDS.addOperator('implies', '⇒');
COMMANDS.addOperator('', '⇒');
COMMANDS.addOperator('st', 's.t.');

COMMANDS.addOperator('lt', '<');
COMMANDS.addOperator('gt', '>')
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

COMMANDS.addUnaryCommand('sup', a => Span('sup', Element('sup', '', '', a)))
COMMANDS.addUnaryCommand('sub', a => Span('sub', Element('sub', '', '', a)))

COMMANDS.addUnaryCommand('arr', a => Grouping(() => SVG("0 0 11 24", '', "M8 0 L3 0 L3 24 L8 24 L8 23 L4 23 L4 1 L8 1"), a))
COMMANDS.addUnaryCommand('abs', a => Grouping(() => SVG("0 0 3 24", '', "M1 0 L2 0 2 24 1 24", .15), a))

// strokeWidth={1} stroke={"black"} fill={"none"}
COMMANDS.addUnaryCommand('angle', a => Grouping(() => SVG("0 0 8 24", '', "M8 0 L0 12 8 24", .3), a))
COMMANDS.addUnaryCommand('paren', a => Grouping(() => SVG("3 0 106 186", '', "M85 0 A61 101 0 0 0 85 186 L75 186 A75 101 0 0 1 75 0"), a))
COMMANDS.addUnaryCommand('set', a => Grouping(() => SVG("10 0 210 350", '', "M170 0 L170 6 A47 52 0 0 0 123 60 L123 127 A35 48 0 0 1 88 175 A35 48 0 0 1 123 223 L123 290 A47 52 0 0 0 170 344 L170 350 L160 350 A58 49 0 0 1 102 301 L103 220 A45 40 0 0 0 58 180 L58 170 A45 40 0 0 0 103 130 L103 49 A58 49 0 0 1 161 0", .7), a))

COMMANDS.addUnaryCommand('int', function (a) {
    return Div('', [
        Element('big', 'int', '∫'),
        ...a
    ])
})

COMMANDS.addUnaryCommand('sqrt', Root)

COMMANDS.addBinaryCommand('frac', Fraction)