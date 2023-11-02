/** @typedef {(HTMLElement|__children_t)[]} __children_t */
/**
 * @param {HTMLElement} el
 * @param {__children_t} arr
 */
function __appendChildrenToEl(el, arr) {
    for (let i of arr) {
        if (!i) continue;

        if (i instanceof HTMLElement) {
            el.appendChild(i);
        } else {
            __appendChildrenToEl(el, i);
        }
    }
}

/** @returns {HTMLElement} */
function Element(elementName, className, innerText = '', children = [], style = '') {
    const el = document.createElement(elementName);
    if (className?.length) el.className = className;
    el.innerText = innerText;
    __appendChildrenToEl(el, children);
    el.style = style;
    return el;
}

/** @returns {HTMLSpanElement} */
function Span(className, innerText = '', children = [], style = '') {
    return Element('span', className, innerText, children, style)
}

/** @returns {HTMLDivElement} */
const Div = (className, children = [], style = '') => Element('div', className, '', children, style);
const SVG = (viewBox, className, path) => {
    const svg = document.createElement('svg');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('viewBox', viewBox);
    if (className?.length) svg.className = className;

    const pathEl = document.createElement('path');
    pathEl.setAttribute('d', path);
    svg.appendChild(pathEl);
    return svg;
}

const TextEl = text => Span('text value', text);
const Digit = digit => Span('digit', digit);
const Var = (letter, italic = true) => Element('var', `${letter === 'f' ? 'letter-f ' : ''}${italic ? '' : 'no-italic '}textual value`, letter);
const BinOp = text => Span("operator infix", text);

const NumberEl = value => Span("number textual value", '', value.split('').map(digit => Digit(digit)));

function Fraction(numerator, denominator) {
    return Span("fraction value", '', [Span('numerator expr', '', numerator), Span('denominator expr', '', denominator), Span('', '\u200b')]);
}

function Grouping(svg, children, width = .55) {
    console.log(svg, children, width);
    const prefix = Span('group-symbol prefix', '', [svg()]);
    const content = Span('group-content', '', children);
    const suffix = Span('group-symbol suffix', '', [svg()]);

    const H = suffix.getBoundingClientRect()?.height ?? 1;
    for (const bracket of [prefix, suffix]) {
        bracket.style.setProperty('--p-height', `${H}px`);
    }

    return Div('grouping value', [prefix, content, suffix], '--prefix-width: width');
}

function Root(children) {
    const root = Span('sqrt prefix', '', [SVG('0 0 32 54', 'sqrt', 'M0 33 L7 27 L12.5 47 L13 47 L30 0 L32 0 L13 54 L11 54 L4.5 31 L0 33')]);
    const inner = Span('sqrt-content expr', '', children);
    const H = inner.current?.getBoundingClientRect()?.height ?? 1;
    root.style.setProperty('--p-height', `${H}px`);

    return Div('sqrt value', [root, inner]);
}