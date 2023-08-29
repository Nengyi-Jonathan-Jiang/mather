import React, {useRef, useState} from 'react';
import './style.css';
import './math-base.css'
import './math-sqrt.css'
import './math-fraction.css'
import './math-grouping.css'
import {MathRenderer} from "./math/math";

function App() {
    const [input, setInput] = useState(
        window.localStorage.getItem('matherSave')
        ??
        "3.14159 a * 180 + \\frac { 2 + \\frac {-2 \\alpha} \\zeta *  \\hbar } { r \\theta + \\frac 2 3 \\pi }"
    );
    const inputEl = useRef<HTMLTextAreaElement>();

    function save(value: string | undefined) {
        window.localStorage.setItem('matherSave', value as string);
    }

    return <>
        <textarea
            spellCheck='false'
            value={input}
            ref={inputEl as any}
            onInput={_ => {
                setInput(inputEl.current?.value as string);
                save(inputEl.current?.value);
            }}
            onKeyDown={e => {
                if (e.key.toLowerCase() === 's' && e.ctrlKey) {
                    save(inputEl.current?.value);
                    e.preventDefault();
                    alert('Saved progress');
                }
            }}
        />
        <div id="math-output">{
            input.split(/\s*\n\s*/g).map(entry => <MathRenderer code={entry}/>)
        }</div>
    </>;
}

export default App;
