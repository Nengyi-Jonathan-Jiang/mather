import React, {CSSProperties, MutableRefObject, ReactElement, useEffect, useRef} from "react";

export function Text({children: text} : {children:string}){
    return <span className='text value'>{text}</span>
}

function Digit({digit} : {digit: string}){
    return <span className="digit">{digit}</span>
}

export function Var({letter, italic=true, useDefaultFont=false} : {letter: string, italic?: boolean, useDefaultFont?: boolean}){
    const c_letter_f = letter === 'f' ? 'letter-f ' : '';
    const c_italic = italic ? '' : 'no-italic ';
    const c_useDefaultFont = useDefaultFont ? 'default-font ' : '';
    return <var className={`${c_letter_f}${c_italic}${c_useDefaultFont}textual value`}>{letter}</var>
}

export function BinOp({text} : {text: string}){
    return <span className="operator infix">{text}</span>
}

export function NumberEl({value} : {value : string}){
    let children = value.split('').map((s, i) => <Digit digit={s} key={i}/>)
    return <span className="number textual value">{children}</span>
}

export function Fraction({numerator, denominator}:{numerator: ReactElement[], denominator: ReactElement[]}) {
    return <span className="fraction value">
        <span className="numerator expr">{numerator}</span>
        <span className="denominator expr">{denominator}</span>
        <span>&#x200B;</span>
    </span>
}

export function Grouping({svg, children, width=.55} : {svg: ()=>ReactElement, children: ReactElement[], width?:number}){
    const lRef = useRef<HTMLElement>();
    const rRef = useRef<HTMLElement>();
    const gRef = useRef<HTMLElement>();

    useEffect(() => {
        const H = gRef.current?.getBoundingClientRect()?.height ?? 1;
        for(const ref of [lRef, rRef]) {
            ref.current?.style?.setProperty('--p-height', `${H}px`);
        }
    });

    return <div className="grouping value" style={{'--prefix-width': width} as CSSProperties}>
        <span className='group-symbol prefix' ref={lRef as any}>{svg()}</span>
        <span className="group-content" ref={gRef as any}>{children}</span>
        <span className='group-symbol suffix' ref={rRef as any}>{svg()}</span>
    </div>
}

export function Root({children} : {children: ReactElement[]}){
    const sRef = useRef<HTMLElement>();
    const pRef = useRef<HTMLElement>();

    useEffect(() => {
        const H = pRef.current?.getBoundingClientRect()?.height ?? 1;
        sRef.current?.style?.setProperty('--p-height', `${H}px`);
    });

    return <div className="sqrt value">
        <span className='sqrt prefix' ref={sRef as any}>
            <svg preserveAspectRatio="none" viewBox="0 0 32 54" className="sqrt">
                <path d="M0 33 L7 27 L12.5 47 L13 47 L30 0 L32 0 L13 54 L11 54 L4.5 31 L0 33"></path>
            </svg>
        </span>
        <span className="sqrt-content expr" ref={pRef as any}>{children}</span>
    </div>
}