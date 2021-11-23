import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faWindowClose, faEdit } from '@fortawesome/free-regular-svg-icons';
import Timer from './Timer';
import EditTimer from './EditTimer';
import './TimerWrapper.css';

const TimerWrapper = ({showTimer, setShowTimer, initialTime, setInitialTime, time, setTime, fiveSec, setFiveSec, runTimer, setRunTimer, fiveSecTime, setFiveSecTime}) => {

    const [editTimer, setEditTimer] = useState(false);
    const [timerType, setTimerType] = useState("count-up");

    const resetTimer = () => {
        setRunTimer(false);
        setTime(initialTime);
        setFiveSecTime(5);
    }

    const toggleShowTimer = () => {
        setShowTimer(state => !state);
        resetTimer();
    }

    const toggleEditTimer = () => {
        setEditTimer(state => !state);
        resetTimer();
    }

    return (
        <>
            {showTimer ? 
                <div className="TimerWrapper">
                    {editTimer ? 
                        <div>
                            <EditTimer 
                                timerType={timerType} 
                                setTimerType={setTimerType} 
                                initialTime={initialTime} 
                                setInitialTime={setInitialTime}
                                toggleEditTimer={toggleEditTimer} 
                                fiveSec={fiveSec}
                                setFiveSec={setFiveSec}
                            />
                        </div>
                        :
                        <div>
                            <Timer 
                                timerType={timerType} 
                                initialTime={initialTime} 
                                setInitialTime={setInitialTime}
                                time={time} 
                                setTime={setTime}
                                fiveSec={fiveSec}
                                fiveSecTime={fiveSecTime}
                                setFiveSecTime={setFiveSecTime}
                                runTimer={runTimer}
                                setRunTimer={setRunTimer}
                            />
                            <div className="TimerWrapper-icons">
                                <div className="TimerWrapper-icon">                    
                                    <FontAwesomeIcon icon={faEdit} onClick={toggleEditTimer} />
                                </div>
                                <div className="TimerWrapper-icon">                    
                                    <FontAwesomeIcon icon={faWindowClose} onClick={toggleShowTimer}/>
                                </div>
                            </div>
                        </div>
                    }
                </div> 
                :
                <div className="TimerWrapper-icon-large">
                    <FontAwesomeIcon icon={faClock}  onClick={toggleShowTimer}/>
                </div>
            }
        </>
    )
}
export default TimerWrapper;
