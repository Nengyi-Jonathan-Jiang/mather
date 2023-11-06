class StringIterator {
    #str;

    /** @type {[RegExp, string][]}*/
    #replacers = [];

    #next = null;

    constructor(str) {
        this.#str = str;
    }

    /** @param {[string,string][]} replacers */
    set replacers(replacers) {
        function sanitizeRegexInput(reg) {
            return reg instanceof RegExp
                ? reg.source
                : reg.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
        }
        this.#replacers = replacers.map(([regex, replacement]) => [
            new RegExp('^' + sanitizeRegexInput(regex)),
            replacement
        ]);
        this.#next = null;
    }

    #get_next() {
        // Try to replace
        for (const [regex, replacement] of this.#replacers) {
            if(this.#str.match(regex)) {
                this.#str = this.#str.replace(regex, replacement);
                break;
            }
        }

        return this.#str[0]
    }

    get next() {
        if(this.done) return null;
        if (this.#next === null) this.#next = this.#get_next();
        return this.#next;
    }

    advance() {
        if(this.done) return;
        this.#str = this.#str.substring(1);
        this.#next = null;
    }

    get done() {
        return this.#str.length === 0;
    }
}

class MathParser {
    static #math_replacements = [
        ['\\*', '\\conj '],
        ['\\+', '\\sup{\\dagger}'],
        [',', '\\comma '],
        [';', '\\semicolon '],
        ['\'', '\\prime'],
        ['\\ihat', '\\hat\\i '],
        ['\\jhat', '\\hat\\j '],
        ['\\khat', '\\hat\\k '],
        ['\\rhat', '\\hat\\b\\r '],
        ['|_^', '\\at\\supsub '],
        ['->', '\\to '],
        ['=>', '\\implies '],
        ['===', '\\equiv '],
        [':=', '\\define '],
        ['::', '\\analogous '],
        [':', '\\ratio '],
        ['...', '\\etc '],
        ['+', '\\plus '],
        ['-', '\\minus '],
        ['*', '\\times '],
        ['/', '\\divide '],
        ['>>', '\\mgt '],
        ['<<', '\\mlt '],
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
    ];
    static #normal_replacements = [
        ['\\\\', '\\break '],
        ['\\h1', '\\heading '],
        ['\\h2', '\\hheading '],
        ['\\h3', '\\hhheading '],
        // ['${', '\\math{'],
        // ['"{', '\\text{'],
        ['_^<', '\\bsupsub '],
        ['_^', '\\supsub '],
        ['^', '\\sup '],
        ['_', '\\sub '],
    ];
    
    static parse(code='') {
        return new MathParser().#parse(code);
    }
    
    #mathmode = false;
    /** @type {StringIterator} */
    #it;
    
    #setMathMode(mode) {
        this.#mathmode = mode;
        if(mode) {
            console.log('entered math mode')
            this.#it.replacers = [...MathParser.#normal_replacements, ...MathParser.#math_replacements];
        }
        else {
            console.log('entered normal mode')
            this.#it.replacers = MathParser.#normal_replacements;
        }
    }
    
    #parse(code) {
        this.#it = new StringIterator(code);
        this.#setMathMode(false);
        return this.#parseMultipleElements();
    }
    
    #parseMultipleElements() {
        let spaces = 0;
        while (!this.#it.done) {
            if(this.#it.next === ' ') spaces++;
            else if(this.#it.next === '$' || this.#it.next === '"') {
                this.#setMathMode(!this.#mathmode);
            }
            else break;
            this.#it.advance();
        }

        if (this.#it.done || this.#it.next === '}') return [];

        let el = this.#parseSingle();

        
        if (!this.#mathmode) {
            el = [TextEl(' '), el]
        }

        return [el, this.#parseMultipleElements()];
    }

    #parseSingle() {
        if(this.#mathmode) return this.#parseSingleMath();
        else return this.#parseSingleWord();
    }

    #parseSingleWord() {
        while (!this.#it.done && this.#it.next.match(/\s/)) this.#it.advance();

        // If block to parse
        if (this.#it.next === '{') {
            this.#it.advance();
            let elements = this.#parseMultipleElements(this.#it);
            this.#it.advance(); // Skip over the closing brace
            return elements
        }

        // If command to parse
        if (this.#it.next === '\\') {
            return this.#parseCommand(this.#it);
        }

        let s = '';
        while (!this.#it.done && !this.#it.next.match(/[\s\$"]/)) {
            s += this.#it.next;
            this.#it.advance();
        }
        if(!this.#it.done && this.#it.next.match(/\s/)) this.#it.advance();
        return TextEl(s);
    }

    #parseSingleMath() {
        while (!this.#it.done && this.#it.next.match(/\s/)) this.#it.advance();
        // If nothing to parse
        if (this.#it.next == null || this.#it.done || this.#it.next === '}') return null
        // If block to parse
        if (this.#it.next === '{') {
            this.#it.advance();
            let elements = this.#parseMultipleElements(this.#it);
            if(this.#it.next === '}') this.#it.advance(); // Skip over the closing brace
            return elements
        }
        // If number to parse
        if (this.#it.next.match(/[\d.]/)) {
            let dPoint = false;
            let n = '';
            while (!this.#it.done && (this.#it.next.match(/\d/) || (this.#it.next === '.' && !dPoint))) {
                if (this.#it.next === '.') dPoint = true;
                n += this.#it.next;
                this.#it.advance();
            }
            log('parsed number: ' + n);
            return NumberEl(n);
        }
        // If command to parse
        if (this.#it.next === '\\') {
            return this.#parseCommand(this.#it);
        }
        // If var to parse
        if (this.#it.next.match(/[a-zA-Z]+/)) {
            let s = this.#it.next;
            this.#it.advance();
            log('parsed variable: ' + s)
            return Var(s)
        }

        log('Unknown:' + this.#it.next);
        let res = TextEl(this.#it.next)
        this.#it.advance();
        return res;
    }

    #parseCommand() {
        this.#it.advance();
        let s = '';
        while (!this.#it.done && this.#it.next.match(/^[a-zA-Z]$/)) {
            s += this.#it.next;
            this.#it.advance();
        }

        if (this.#hasSymbol(s)) {
            return this.#createSymbol(s);
        } else if (this.#hasUnaryCommand(s)) {
            let p1 = this.#parseSingle();
            return this.#applyUnaryCommand(s, p1);
        } else if (this.#hasBinaryCommand(s)) {
            let p1 = this.#parseSingle();
            let p2 = this.#parseSingle();
            return this.#applyBinaryCommand(s, p1, p2);
        } else return TextEl(`\\${s}`);
    }

    #hasSymbol(s) {
        return this.#mathmode && MATH_COMMANDS.hasSymbol(s) || COMMANDS.hasSymbol(s);
    }
    #hasUnaryCommand(s) {
        return this.#mathmode && MATH_COMMANDS.hasUnaryCommand(s) || COMMANDS.hasUnaryCommand(s);
    }
    #hasBinaryCommand(s) {
        return this.#mathmode && MATH_COMMANDS.hasBinaryCommand(s) || COMMANDS.hasBinaryCommand(s);
    }
    #createSymbol(s) {
        return this.#mathmode && MATH_COMMANDS.hasSymbol(s) && MATH_COMMANDS.createSymbol(s) || COMMANDS.createSymbol(s);
    }
    #applyUnaryCommand(s, a) {
        return this.#mathmode && MATH_COMMANDS.hasUnaryCommand(s) && MATH_COMMANDS.applyUnaryCommand(s, a) || COMMANDS.applyUnaryCommand(s, a);
    }
    #applyBinaryCommand(s, a, b) {
        return this.#mathmode && MATH_COMMANDS.hasBinaryCommand(s) && MATH_COMMANDS.applyBinaryCommand(s, a, b) || COMMANDS.applyBinaryCommand(s, a, b);
    }
}