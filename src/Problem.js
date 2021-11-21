import React, {useEffect, useState, useRef, useContext} from 'react';
import ScoreContext from './ScoreContext';
import axios from 'axios';
import { addStyles, StaticMathField, EditableMathField } from 'react-mathquill';
import correctSound from './correct-6033.mp3';

import './Problem.css';

import ConfettiExplosion from '@reonomy/react-confetti-explosion';


const Problem = ({op}) => {
    const [exp, setExp] = useState(null);
    const [prob, setProb] = useState(null);
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState(null);
    const [prevAttempts, setPrevAttempts] = useState([]);
    const [isExploding, setIsExploding] = React.useState(false);
    const answerField = useRef();
    const newProbBtn = useRef();
    const {scores, setScores} = useContext(ScoreContext);

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

            let newScores = {...scores};
            newScores[op]["correct"] = newScores[op]["correct"] + 1;
            newScores[op]["attempted"] = newScores[op]["attempted"] + 1;
            setScores(newScores);
        } 
        if (status==='incorrect') {
            setTimeout(() => {
                setStatus(null);
                setAnswer("");
            }, 1000);

            let newScores = {...scores};            
            newScores[op]["incorrect"] = newScores[op]["incorrect"] + 1;
            newScores[op]["attempted"] = newScores[op]["attempted"] + 1;
            setScores(newScores);
        } 
    }, [status]);
    

    // const handleChange = (mathField) => {
    //     setAnswer(mathField.latex());
    // }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (answer === "") return;
        const response = await axios.post(`http://localhost:3000/integerop/`, 
                                            {   
                                                probType: prob.problemType,
                                                args: prob.args,
                                                answer
                                            } );

        setStatus(response.data.status);
        if (response.data.status === 'correct') {
            setIsExploding(true);
        }
        if (response.data.status ==='incorrect') {
            setTimeout(() => {
                setPrevAttempts(prevAttempts => [...prevAttempts, answer]);
            }, 1200)
        }
    }

    const handleNewProblem = () => {
        if (status === null) {
            let newScores = {...scores};            
            newScores[op]["attempted"] = newScores[op]["attempted"] + 1;
            setScores(newScores);
        }

        setExp(null);
        setStatus(null);
        setAnswer("");
        setPrevAttempts([]);
    }

    const renderStatus = () => {
        if (status) {
            if (status==="correct") {
                return (
                    <>
                        <audio autoPlay>
                            <source src={correctSound} type="audio/mp3" />
                        </audio> 
                        <h1>Correct!</h1>
                        {isExploding && <ConfettiExplosion  />}
                    </>
                )
            } else {
                return (
                    <>
                        <h1>Try again!</h1>
                    </>
                )
            }
        }
        return null;
    }

    const renderPrevAttempts = () => {
        if (prevAttempts.length) {
            return (
                <p>Previous attempts:
                    {prevAttempts.map((att,i) => {
                        if (i === 0) return (<span>{`  ${att}`}</span>)
                        return (<span>{`,  ${att}`}</span>)
                    })
                    }
                </p>
            )
        }
        return null;
    }


    // const handleKeyDown = (evt): void => {
    const handleKeyDown = (evt) => {
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
                <div className="Problem-status">
                    {status!=="correct" ? <button className="Problem-check-btn" type="submit">Check</button> : null}
                    {renderStatus()}
                </div>
                <div className="Problem-prev-attempts">
                    {renderPrevAttempts()}
                </div>
        
                {/* <button className="Problem-check-btn" type="submit" disabled={status==="correct"}>Check</button> */}
            </form>
            {/* <div className="Problem-status">
                {renderStatus()}
            </div>
            <div className="Problem-prev-attempts">
                {renderPrevAttempts()}
            </div>
         */}

            <div className="Problem-new-btn-div">
                <span>
                    <button className="Problem-new-btn" onClick={handleNewProblem} type="button" ref={newProbBtn}>New problem</button>
                </span>
            </div>
        </div>
    )
}

export default Problem;