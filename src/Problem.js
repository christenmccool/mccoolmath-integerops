import React, {useEffect, useState, useRef, useContext} from 'react';
import ScoreContext from './ScoreContext';
import axios from 'axios';
import { addStyles, StaticMathField, EditableMathField } from 'react-mathquill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faStar } from '@fortawesome/free-solid-svg-icons';

import ConfettiExplosion from '@reonomy/react-confetti-explosion';
import correctSound from './correct-6033.mp3';
import './Problem.css';



const Problem = ({op}) => {
    const [exp, setExp] = useState(null);
    const [prob, setProb] = useState(null);
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState(null);
    const [prevAttempts, setPrevAttempts] = useState([]);
    const [ding, setDing] = useState(true);
    const [fireworks, setFireworks] = useState(true);
    const [isExploding, setIsExploding] = useState(false);
    const answerField = useRef();
    const newProbBtn = useRef();
    const audioField = useRef();
    const {scores, setScores} = useContext(ScoreContext);

    const [error, setError] = useState(null);
    addStyles();

    const iconVolclass = ding ? "Problem-icon" : "Problem-icon Problem-icon-off"
    const iconStarclass = fireworks ? "Problem-icon" : "Problem-icon Problem-icon-off"

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
            if (fireworks) setIsExploding(true);
            if (ding) audioField.current.play();
        }
        if (response.data.status ==='incorrect') {
            setIsExploding(false);
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
        setIsExploding(false);
    }

    // const renderStatus = () => {
    //     if (status) {
    //         if (status==="correct") {
    //             return (
    //                 <>
    //                     <h1>Correct!</h1>
    //                     {fireworks && isExploding && <ConfettiExplosion  />}
    //                 </>
    //             )
    //         } else {
    //             return (
    //                 <>
    //                     <h1>Try again!</h1>
    //                 </>
    //             )
    //         }
    //     }
    //     return null;
    // }

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

    const handleKeyDown = (evt) => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            evt.stopPropagation();
            handleSubmit(evt);
        }
      }
    
    const toggleDing = () => {
        if (!ding) {
            audioField.current.play();
        }
        setIsExploding(false);
        setDing(!ding);
    }

    const toggleFireworks = () => {
        setFireworks(!fireworks);
    }

    return (
        <div className="Problem">
            <div className="Problem-exp">
                <StaticMathField>
                    {exp}
                </StaticMathField>
            </div>
            <audio ref={audioField} src={correctSound} type="audio/mp3" />
            <form className="Problem-answer" onSubmit={handleSubmit} >
                <div ref={answerField}>
                    <EditableMathField
                        latex={answer}
                        onChange={(mathField) => setAnswer(mathField.latex())}
                        onKeyDown={handleKeyDown}
                        className="Problem-answer-field"
                    />
                </div>
                <div className="Problem-status">
                    {status!=="correct" ? <button className="Problem-check-btn" type="submit">Check</button> : null}
                    {/* {renderStatus()} */}
                    <h1>{status==='correct' ? "Correct!" : status==='incorrect' ? "Try Again" : null}</h1>  
                    {fireworks && isExploding && <ConfettiExplosion  />}              
                </div>
                <div className="Problem-prev-attempts">
                    {renderPrevAttempts()}
                </div>
            </form>

            <div className="Problem-new-btn-div">
                <div className="Problem-icons">
                    <div className={iconVolclass}>                    
                        <FontAwesomeIcon icon={faVolumeUp} onClick={toggleDing} />
                    </div>
                    <div className={iconStarclass}>                    
                        <FontAwesomeIcon icon={faStar} onClick={toggleFireworks}/>
                    </div>
                </div>
                <div>
                    <button className="Problem-new-btn" onClick={handleNewProblem} type="button" ref={newProbBtn}>New problem</button>
                </div>
            </div>
        </div>
    )
}

export default Problem;