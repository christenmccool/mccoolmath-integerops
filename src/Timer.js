import React, { useState, useEffect } from 'react';
import './Timer.css';


const Timer = ({timerType, initialTime, time, setTime, runTimer, setRunTimer, fiveSec, fiveSecTime, setFiveSecTime, auto=false}) => {

    const [runFiveSec, setRunFiveSec] = useState(false); 
    
    useEffect(() => {
        if (auto) {
            setRunTimer(true);
        }
    }, [auto])

    useEffect(() => {
        setTime(initialTime);
    }, [initialTime])

    useEffect(() => {
        let timerId;
    
        if (runFiveSec) {
            let initialTime = 5;
            let count = 0;

            timerId = setInterval(() => {   
                count++;
                if (initialTime - count <= 0) {
                    clearInterval(timerId);
                    setRunFiveSec(false);
                }
                setFiveSecTime(initialTime - count);
            }, 1000);
        } else {
            clearInterval(timerId);
        }
    
        return () => clearInterval(timerId);
    }, [runFiveSec]);

    useEffect(() => {
        if (fiveSec && !runFiveSec && !runTimer && fiveSecTime===0) {
            setRunTimer(true);
        }
    }, [runFiveSec, fiveSecTime])

    useEffect(() => {
        let timerId;
    
        if (runTimer) {
            let currTime = Date.now();                

            if (timerType === 'count-up') {
                timerId = setInterval(() => {
                    let timeEllapsed = initialTime + Date.now() - currTime;
                    console.log(timeEllapsed);
                    setTime(timeEllapsed);
                }, 1000);
            } else if (timerType === 'count-down') {
                timerId = setInterval(() => {
                    let timeRemaining = initialTime - (Date.now() - currTime);
                    console.log(timeRemaining);
                    if (timeRemaining < 100) {
                        clearInterval(timerId);
                        setRunTimer(false);
                    }
                    setTime(timeRemaining);
                }, 1000);
            }
        } else {
            clearInterval(timerId);
        }
    
        return () => clearInterval(timerId);
    }, [runTimer]);

    const formatTime = (time) => {
        let totalSeconds = Math.round(time / 1000);

        if (totalSeconds < 0) {
            console.log(totalSeconds);
            totalSeconds = 0;
        }

        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        let minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        let secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

        let timeStr = `${minStr}:${secStr}`
        return timeStr;
    }

    const toggleRunTimer = () => {
        if (!fiveSec) {
            if (!runTimer && time===initialTime) {
                setRunTimer(true);
            } else {
                setRunTimer(false);
            }
        } else if (fiveSec) {
            if (!runFiveSec && fiveSecTime===5) {
                setRunFiveSec(true);
            } else {
                setRunFiveSec(false);
                setRunTimer(false);
            }
        }
    }

    const resetTimer = () => {
        setRunTimer(false);
        setRunFiveSec(false);
        setTime(initialTime);
        setFiveSecTime(5);
    }

    const renderStartBtn = () => {
        if (!fiveSec) {
            if (!runTimer && time===initialTime) {
                return "Start"
            } 
        } else if (fiveSec) {
            if (!runFiveSec && fiveSecTime===5) {
                return "Start"
            } 
        }
        return "Stop";
    }

    return (
        <div className="Timer">
            <div className="Timer-main">
                <div className="Timer-display">
                    <h1>{formatTime(time)}</h1>
                </div>
                <div className="Timer-buttons">
                    <button className="Timer-start-btn" type="button" onClick={toggleRunTimer}>
                        {renderStartBtn()}
                    </button>
                    <button className="Timer-reset-btn" type="button" onClick={resetTimer}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default Timer;
