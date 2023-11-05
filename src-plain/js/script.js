function render(str, targetElement){
    while(targetElement.firstChild) targetElement.firstChild.remove();
    for(let s of str.split(/\s*\n\s*/g)) {
        let parse = MathParser.parse(s);
        let d = Div('math', parse)
        targetElement.appendChild(d);
    }
    recalculate_sizes(targetElement);
}

function save(value) {
    if (value) {
        window.localStorage.setItem('matherSave', value);
    }
}

function mathChildren(el) {
    return [...(el.childNodes ?? [])].filter(i => {
        if(i.tagName === 'SPAN') return true;
        if(i.tagName === 'DIV') return true;
        if(i.tagName === 'SUP') return true;
        if(i.tagName === 'SUB') return true;
        if(i.tagName === 'BIG') return true;

        return false;
    });
}

/** @param {HTMLElement} parent */
function recalculate_sizes(parent) {
    // console.log(parent)

    let children = mathChildren(parent)

    // console.log(children)

    children.forEach(recalculate_sizes);

    for(let el of children) {
        if(el.className.includes('prefix') || el.className.includes('suffix')) {
            let h = 10;
            for(let e of children.filter(i => i.className.includes('expr'))) {
                h = Math.max(h, e.clientHeight);
            }
            el.style.setProperty('--p-height',h + 'px');
        }
    }
}

const displayEl = document.createElement('div')
displayEl.id = 'math-output'

const savedInput = (
    window.localStorage.getItem('matherSave') ?? "\"Integration by parts example: \"x  \\sin(x)\n\"\n\\int_^0\\pi x\\sin(x)dx\n\\indent\\Let  u=x, dv=\\sin(x)dx,\n\\indent\\indent du=dx, v=-\\cos(x)\n=[-x\\cos(x)]_^0\\pi+\\int_^0\\pi\\cos(x)dx\n=\\sin(x)|_^0\\pi-\\pi\\cos\\pi\n=\\box{\\pi}\n\"\n\"\n\"Sulfur (S) and sulfur dioxide (SO\"_2\") can react with Ozone to form sulfuric acid (H\"_2\\SO_4\") in the following reactions:\n\"\n\\indent\\S_\"(s)\" + \\H_2\\O_\"(l)\" + \\O_3_\"(g)\" \\to \\H_2\\S\\O_4_\"(aq)\"\n\\indent3\\SO_2_\"(g)\" + 3\\H_2\\O_\"(l)\" + \\O_3_\"(g)\"\\to 3\\H_2\\S\\O_4_\"(aq)\"\n\"\n\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"\n\n\"The Riemann zeta function can also be written as \"\\zeta(z)=\\frac1{\\Gamma(z)}\\int_^0\\inf \\frac {t^{z-1}}{e^t-1}dt \", where the Gamma function \"\\Gamma(z)={\\int_^0\\inf e^{-t}t^{z-1}dt}.\" Like the sumnation form of the zeta function, this formula only works if \"\\re(z)>1\". However, we can extend the function to all \"z!=1\" using analytic continuation."
)
console.log(savedInput)
const inputEl = document.createElement('textarea');
inputEl.spellcheck = false;
inputEl.value = savedInput;
inputEl.oninput = _ => {
    save(inputEl.value);
    render(inputEl.value, displayEl)
}

render(inputEl.value, displayEl)

document.getElementById('root').append(displayEl, inputEl)

window.onresize = _ => {
    recalculate_sizes(displayEl);
}