function render(str, targetElement){
    let parse = MathParser.parse(str);
    let d = Div('math', parse)
    while(targetElement.firstChild) targetElement.firstChild.remove();
    targetElement.appendChild(d)
}

function save(value) {
    if (value) {
        window.localStorage.setItem('matherSave', value);
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

document.getElementById('root').append(inputEl, displayEl)