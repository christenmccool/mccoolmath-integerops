import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faWindowClose, faEdit } from '@fortawesome/free-regular-svg-icons';
import Timer from './Timer';
import EditTimer from './EditTimer';
import './TimerWrapper.css';
import Draggable from 'react-draggable';

const TimerWrapper = () => {
    const [showTimer, setShowTimer] = useState(false);
    const [editTimer, setEditTimer] = useState(false);
    const [fiveSec, setFiveSec] = useState(true);

    const [timerType, setTimerType] = useState("count-up");
    const [initialTime, setInitialTime] = useState(0);

    const [time, setTime] = useState(0);
    const [runTimer, setRunTimer] = useState(false);

    const toggleShowTimer = () => {
        setShowTimer(state => !state);
        setRunTimer(false);
    }

    const toggleEditTimer = () => {
        setEditTimer(state => !state);
        setTime(initialTime);
        setRunTimer(false);
    }

    return (
        <>
            {showTimer ? 
                <Draggable>
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
                                runTimer={runTimer}
                                setRunTimer={setRunTimer}
                                buttons={true} 
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
                </Draggable>
                :
                <div className="TimerWrapper-icon-large">
                    <FontAwesomeIcon icon={faClock}  onClick={toggleShowTimer}/>
                </div>
            }
        </>
    )
}
export default TimerWrapper;
