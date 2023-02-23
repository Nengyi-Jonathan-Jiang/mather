import React, {MutableRefObject, ReactElement, useEffect, useRef} from "react";

export function Text({children: text} : {children:string}){
    return <span className='text value'>{text}</span>
}

function Digit({digit} : {digit: string}){
    return <span className="digit textual value">{digit}</span>
}

export function Var({letter, italic=true} : {letter: string, italic?: boolean}){
    return italic
        ? letter === 'f'
            ? <var className='letter-f textual value'>f</var>
            : <var className='textual value'>{letter}</var>
        : <var data-noitalic='' className='textual value'>{letter}</var>
}

export function BinOp({text} : {text: string}){
    return <span className="operator infix">{text}</span>
}

export function MinusSign(){
    return <span className="minus-sign operator infix"></span>
}

export function NumberEl({value} : {value : string}){
    let children = value.split('').map((s, i) => <Digit digit={s} key={i}/>)
    return <span className="number value">{children}</span>
}

export function Fraction({numerator, denominator}:{numerator: ReactElement[], denominator: ReactElement[]}) {
    return <span className="fraction value">
        <span className="numerator expr">{numerator}</span>
        <span className="denominator expr">{denominator}</span>
        <span>&#x200B;</span>
    </span>
}

export function Grouping({svg, children} : {svg: (ref:MutableRefObject<SVGSVGElement>,side:string)=>ReactElement, children: ReactElement[]}){
    const lRef = useRef<HTMLElement>();
    const rRef = useRef<HTMLElement>();
    const gRef = useRef<HTMLElement>();

    useEffect(() => {
        const H = gRef.current?.getBoundingClientRect()?.height ?? 1;
        for(const ref of [lRef, rRef]) {
            ref.current?.style?.setProperty('--p-height', `${H}px`);
        }
    });

    return <div className="grouping value">
        {svg(lRef as any, 'left')}
        <span className="group-content" ref={gRef as any}>{children}</span>
        {svg(rRef as any, 'right')}
    </div>
}