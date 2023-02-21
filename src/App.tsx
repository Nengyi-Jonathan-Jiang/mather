import React, {useRef, useState} from 'react';
import './style.css';
import {MathRenderer} from "./components/math/math";

function App() {
    const [input, setInput] = useState("3.14159 a \\times 180 \\plus \\frac { 2 \\plus \\frac {-2 \\alpha} \\zeta + \\beta } { r \\theta \\plus \\frac 2 3 \\pi }");
    const ref = useRef<HTMLTextAreaElement>();
    return <>
        <textarea value={input} ref={ref as any} onInput={e => setInput(ref.current?.value as string)}/>
        <MathRenderer code={input}/>
    </>;
}

export default App;
