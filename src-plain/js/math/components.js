/** @typedef {(HTMLElement|__children_t)[]} __children_t */
/**
 * @param {HTMLElement} el
 * @param {__children_t} children
 */
function __appendChildrenToEl(el, children) {
    if (!children) return;
    if (children instanceof Node) {
        el.appendChild(children);
    } else {
        for (let i of children) {
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
const SVG = (viewBox, className, path, fill = true) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttributeNS(null, 'preserveAspectRatio', 'none');
    if (fill) {
        svg.setAttributeNS(null, 'fill', 'black')
        svg.setAttributeNS(null, 'stroke', 'none');
    } else {
        svg.setAttributeNS(null, 'fill', 'none')
        svg.setAttributeNS(null, 'stroke', 'black');
        svg.setAttributeNS(null, 'stroke-width', '1');
    }

    svg.setAttributeNS(null, 'viewBox', viewBox);
    if (className?.length) svg.className = className;

    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    pathEl.setAttributeNS(null, 'd', path);
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

function SupSub(bottom, top, before = false) {
    return Span(`supsub value${before ? ' before' : ''}`, '', [
        top ? Span('supsub-top expr', '', [
            Span('supsub-inner expr', '', top)
        ]) : null,
        bottom ? Span('supsub-bottom expr', '', [
            Span('supsub-inner expr', '', bottom)
        ]) : null,
        Span('', '\u200b')
    ]);
}

function Grouping(svg, children, width = .55) {
    const prefix = Span('group-symbol prefix', '', [svg()]);
    const content = Span('group-content expr', '', children);
    const suffix = Span('group-symbol suffix', '', [svg()]);

    const H = suffix.getBoundingClientRect()?.height ?? 1;
    for (const bracket of [prefix, suffix]) {
        bracket.style.setProperty('--p-height', `${H}px`);
    }

    return Div('grouping value', [prefix, content, suffix], `--prefix-width: ${width}`);
}

function Sqrt(children) {
    const root = Span('sqrt prefix', '', [SVG('0 0 32 54', 'sqrt', 'M0 33 L7 27 L12.5 47 L13 47 L30 0 L32 0 L13 54 L11 54 L4.5 31 L0 33')]);
    const inner = Span('sqrt-content expr', '', children);

    return Div('sqrt value', [root, inner]);
}

function Box(children) {
    return Div('box value', children);
}


function WideHat(children) {
    const hat = Span('hat above-line', '', [SVG(
        '0 0 6 5', '',
        'M0 5 L 0 4.5 3 0 6 4.5 6 5 3 2'
    )]);
    const inner = Span('hat above-content expr', '', children);

    return Div('hat above value', [hat, inner]);
}

function Bar(children) {
    const line = Span('bar above-line', '', [SVG(
        '0 0 6 5', '',
        'M0 2 L6 2 6 3 0 3'
    )]);
    const inner = Span('bar above-content expr', '', children);

    return Div('hat above value', [line, inner]);
}

function Vec(children) {
    const arrow = Span('vec above-line', '', [SVG(
        '0 0 6 5', '',
        'M0 2.25 L5 2.25 4.5 0 6 2.5 4.5 5 5 2.75 0 2.75'
    )]);
    const inner = Span('vec above-content expr', '', children);

    return Div('vec above value', [arrow, inner]);
}