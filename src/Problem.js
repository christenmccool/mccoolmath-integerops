import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { addStyles, StaticMathField, EditableMathField } from 'react-mathquill';
import {NavLink} from 'react-router-dom';

import './Problem.css';


const Problem = ({op}) => {
    const [exp, setExp] = useState(null);
    const [prob, setProb] = useState(null);
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState(null);
    const answerField = useRef();
    const newProbBtn = useRef();


    const [error, setError] = useState(null);
    addStyles();

    useEffect(() => {
        if (exp) return;
        const getData = async () => {
            try {
                const path = op ? `http://localhost:3000/integerop/${op}` : `http://localhost:3000/integerop/`;
                const response = await axios.get(path);
                setExp(response.data.exp);
                setProb(response.data);
                setStatus(null);
                setAnswer("");
            } catch(err) {
                setError(error => err);
            }
        }
        getData();
    }, [exp]);

    useEffect(() =>  {
        answerField.current.children[0].children[0].children[0].focus();
        if (status==='correct') {
            newProbBtn.current.focus();
        }
    }, [status]);
    

    // const handleChange = (mathField) => {
    //     setAnswer(mathField.latex());
    // }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const response = await axios.post(`http://localhost:3000/integerop/`, 
                                            {   
                                                probType: prob.problemType,
                                                args: prob.args,
                                                answer
                                            } );

        setStatus(response.data.status);
    }

    const renderStatus = () => {
        if (status) {
            if (status==="correct") return <h2>Correct!</h2>;
            if (status==="incorrect") return <h2>Try again!</h2>;
        }
        return null;
    }

    const handleKeyDown = (evt): void => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            evt.stopPropagation();
            handleSubmit(evt);
        }
      }
  
    return (
        <div className="Problem">
            <div className="Problem-exp">
                <StaticMathField>
                    {exp}
                </StaticMathField>
            </div>
            <form className="Problem-answer" onSubmit={handleSubmit} >
                <div ref={answerField}>
                    <EditableMathField
                        latex={answer}
                        // onChange={handleChange}
                        onChange={(mathField) => setAnswer(mathField.latex())}
                        onKeyDown={handleKeyDown}
                        className="Problem-answer-field"
                    />
                </div>
                <button className="Problem-check-btn" type="submit">Check</button>
            </form>
            {renderStatus()}
            <button className="Problem-new-btn" onClick={()=>setExp(null)} type="button" ref={newProbBtn}>New problem</button>
        
            <NavLink exact to="/">Home</NavLink>
        </div>
    )
}

export default Problem;