import React, {useEffect, useState, useRef, useContext} from 'react';
import ScoreContext from './ScoreContext';
import axios from 'axios';
import { addStyles, StaticMathField, EditableMathField } from 'react-mathquill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faStar } from '@fortawesome/free-solid-svg-icons';
import ConfettiExplosion from '@reonomy/react-confetti-explosion';
import correctSound from './correct-6033.mp3';
import './Problem.css';

/** Problem component
 *
 * Retrieves a problem of type 'op' from the McCool Math API
 * choices for op: add, sub, mult, div
 * If no op prop passed, retrieves mixed problem types
 *  
 * For each problem, user can check the answer they have typed 
 * or show the correct answer
 * For an incorrect answer, user can try again or show answer
 * Showing the answer adds 1 to attempted problems
 * 
 * Ding and confetti can be toggled on/off for correct answers
 * 
 * MathQuill API formats problem and answer input field
 */

const Problem = ({op}) => {
    const [exp, setExp] = useState(null);
    const [prob, setProb] = useState(null);
    const [answer, setAnswer] = useState("");
    const [checkingAnswer, setCheckingAnswer] = useState(false);
    const [status, setStatus] = useState(null);
    const [fetchingCorrAnswer, setFetchingCorrAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [prevAttempts, setPrevAttempts] = useState([]);
    const [ding, setDing] = useState(true);
    const [fireworks, setFireworks] = useState(true);
    const [isExploding, setIsExploding] = useState(false);

    // useRef is used to focus on buttons and answerField
    const answerField = useRef();
    const newProbBtn = useRef();
    const tryAgainBtn = useRef();
    const audioField = useRef();

    // Store scores for each skill to be used by the Scoreboard
    const {scores, setScores} = useContext(ScoreContext);

    const [error, setError] = useState(null);
    addStyles();

    // Disabled view for sound and effect toggle icons
    const iconVolclass = ding ? "Problem-icon" : "Problem-icon Problem-icon-off"
    const iconStarclass = fireworks ? "Problem-icon" : "Problem-icon Problem-icon-off"

    /** New problem is retrieved from McCool Math API 
     * Type of problem indicated by op: add, sub, mult, div
     * Without op parameter, retrieves random problem
     *
     * Executes after exp changes (is set to null)
     * Entire problem is stored in prob
     * Expression to be displayed to user is stored in exp
    */
    useEffect(() => {
        if (exp) return;
        const getData = async () => {
            try {
                const path = op!=="mix" ? `http://localhost:3000/integerop/${op}` : `http://localhost:3000/integerop/`;
                const response = await axios.get(path);
                setExp(response.data.exp);
                setProb(response.data);
            } catch(err) {
                setError(error => err);
            }
        }
        getData();
    }, [exp]);

    /** User answer posts to McCool Math API 
     * API response is status 'correct' or 'incorrect'
    */
    useEffect(() => {
        if (!checkingAnswer) return;
        const postUserAnswer = async () => {
            try {
                const response = await axios.post(`http://localhost:3000/integerop/`, 
                    {   
                        probType: prob.problemType,
                        args: prob.args,
                        answer
                    } );
                setStatus(response.data.status);
            } catch(err) {
                setError(error => err);
            }
        }
        postUserAnswer();
        setCheckingAnswer(false);
    }, [checkingAnswer]);

    /** Obtain correct answer to problem from McCool Math API 
    */
    useEffect(() => {
        if (!fetchingCorrAnswer) return;
        const fetchCorrAnswer = async () => {
            try {
                const response = await axios.post(`http://localhost:3000/integerop/`, 
                    {   
                        probType: prob.problemType,
                        args: prob.args,
                        answer,
                        returnAnswer: true
                    } );
                setCorrectAnswer(response.data.correctAnswer);
            } catch(err) {
                setError(error => err);
            }
        }
        fetchCorrAnswer();
        setFetchingCorrAnswer(false);
    }, [fetchingCorrAnswer]);
    
    // Update score on status changes and when a correct answer is shown 
    // Set focus on button or field based on status
    useEffect(() =>  {
        if (status===null && correctAnswer===null) {
            answerField.current.children[0].children[0].children[0].focus();
            return;
        }
        let newScores = {...scores};
        newScores[op]["attempted"] = newScores[op]["attempted"] + 1;

        if (correctAnswer!==null) {
            setIsExploding(false);
            newScores[op]["incorrect"] = newScores[op]["incorrect"] + 1;
            newProbBtn.current.focus();
        }
        if (status === 'correct') {
            if (fireworks) setIsExploding(true);
            if (ding) audioField.current.play();

            newScores[op]["correct"] = newScores[op]["correct"] + 1;
            newProbBtn.current.focus();
        }
        if (status ==='incorrect' && correctAnswer===null) {
            setIsExploding(false);
            setPrevAttempts(prevAttempts => [...prevAttempts, answer]);

            newScores[op]["incorrect"] = newScores[op]["incorrect"] + 1;
            tryAgainBtn.current.focus();
        }
        setScores(newScores);
    }, [status, correctAnswer]);

    // Handle submit of user answer
    // Triggers call to McCool Math API to check user answer
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (answer === "") return;

        setCheckingAnswer(true);
    }

    // Handle user request for correct answer
    // Triggers call to McCool Math API for correct answer
    const handleGetCorrAnswer = async () => {
        setFetchingCorrAnswer(true);
    }

    // Handle request for new problem
    // Triggers call to McCool Math API for new expression
    const handleNewProblem = () => {
        setExp(null);
        setStatus(null);
        setAnswer("");
        setPrevAttempts([]);
        setIsExploding(false);
        setCorrectAnswer(null);
    }

    // Handle user choice to try again on same problem
    const handleTryAgain = () => {
        setStatus(null);
        setAnswer("");
    }

    // Submit answer on return
    const handleKeyDown = (evt) => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            evt.stopPropagation();
            handleSubmit(evt);
        }
    }
    
    const toggleDing = () => {
        // if (!ding) {
        //     audioField.current.play();
        // }
        setIsExploding(false);
        setDing(!ding);
    }

    const toggleFireworks = () => {
        if (!fireworks) {
            setIsExploding(true);
        }
        setFireworks(!fireworks);
    }

    // Renders list of previous user answers for the problem
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

    return (
        <div className="Problem">
            <div className="Problem-exp">
                <StaticMathField>
                    {exp}
                </StaticMathField>
            </div>
            <audio ref={audioField} src={correctSound} type="audio/mp3" />
            {/* {fireworks && isExploding && <ConfettiExplosion  />}    */}
            {status && status==='correct' ?
                <div className="Problem-answer">
                    <StaticMathField>
                        {answer}
                    </StaticMathField>
                    <div className="Problem-status">
                        {fireworks && isExploding && <ConfettiExplosion  />}   
                        <h1>Correct!</h1>        
                    </div>
                </div> : null}
            {status && status==='incorrect' && correctAnswer===null ?
                <div className="Problem-answer">
                    <StaticMathField>
                        {answer}
                    </StaticMathField>
                    <div className="Problem-status">
                        <h1>Incorrect</h1>    
                        <div className="Problem-prev-attempts">
                            {renderPrevAttempts()}
                        </div>           
                    </div>
                </div>: null}
            {!status && correctAnswer===null ? 
                <form className="Problem-answer" onSubmit={handleSubmit} >
                    <div ref={answerField}>
                        <EditableMathField
                            latex={answer}
                            onChange={(mathField) => setAnswer(mathField.latex())}
                            onKeyDown={handleKeyDown}
                            className="Problem-answer-field"
                        />
                    </div>
                    <button className="Problem-check-btn" type="submit">Check</button>
                </form> : null
            }

            {correctAnswer!==null ? 
                <div className="Problem-answer">
                    <StaticMathField>
                        {correctAnswer}
                    </StaticMathField>
                    <div className="Problem-status">
                        <div className="Problem-prev-attempts">
                            {renderPrevAttempts()}
                        </div>           
                    </div>
                </div> : null
            }
               
            <div className="Problem-new-btn-div">
                <div className="Problem-icons">
                    <div className={iconVolclass}>                    
                        <FontAwesomeIcon icon={faVolumeUp} onClick={toggleDing} />
                    </div>
                    <div className={iconStarclass}>                    
                        <FontAwesomeIcon icon={faStar} onClick={toggleFireworks}/>
                    </div>
                </div>
                {status === 'correct' || correctAnswer!==null ?
                    <div className="Problem-buttons">
                         <button className="Problem-other-btn" onClick={handleNewProblem} type="button" ref={newProbBtn}>Next</button>
                     </div>
                    :
                    status === 'incorrect'  ?
                        <div className="Problem-buttons">
                            <button className="Problem-other-btn" type="button" onClick={handleGetCorrAnswer}>Show answer</button>
                            <button className="Problem-other-btn" type="button" onClick={handleTryAgain} ref={tryAgainBtn}>Try again</button>
                        </div>
                        :
                        <div className="Problem-buttons">
                            <button className="Problem-other-btn" type="button" onClick={handleGetCorrAnswer}>Show answer</button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Problem;