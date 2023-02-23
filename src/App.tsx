import React, {useRef, useState} from 'react';
import './style.css';
import {MathRenderer} from "./components/math/math";

function App() {
    const [input, setInput] = useState("3.14159 a * 180 + \\frac { 2 + \\frac {-2 \\alpha} \\zeta *  \\beta } { r \\theta + \\frac 2 3 \\pi }");
    const ref = useRef<HTMLTextAreaElement>();
    return <>
        <textarea value={input} ref={ref as any} onInput={e => setInput(ref.current?.value as string)}/>
        <div id="math-output">{
            input.split(/(\s*\n\s*){2,}/g).map(entry => <MathRenderer code={entry}/>)
        }</div>
    </>;
}

export default App;
