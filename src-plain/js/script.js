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
    window.localStorage.getItem('matherSave') ?? "3.14159 a * 180 + \\frac { 2 + \\frac {-2 \\alpha} \\zeta *  \\hbar } { r \\theta + \\frac 2 3 \\pi }"
)
console.log(savedInput)
const inputEl = document.createElement('textarea');
inputEl.spellcheck = false;
inputEl.value = savedInput;
inputEl.oninput = inputEl.onkeydown = inputEl.onchange = _ => {
    save(inputEl.value);
    render(inputEl.value, displayEl)
}

render(inputEl.value, displayEl)

document.getElementById('root').append(inputEl, displayEl)

window.onresize = _ => {
    recalculate_sizes(displayEl);
}