import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import './EditTimer.css';

const EditTimer = ({timerType, setTimerType, initialTime, setInitialTime, toggleEditTimer, fiveSec, setFiveSec}) => {

    let totalSeconds = Math.round(initialTime / 1000);
    let initalMinutes = Math.floor(totalSeconds / 60);
    let initialSeconds = totalSeconds % 60;

    const [startMinutes, setStartMinutes] = useState(initalMinutes);
    const [startSeconds, setStartSeconds] = useState(initialSeconds);

    const handleCheckChange = (evt) => {
        setTimerType(evt.target.checked ? "count-down" : "count-up");
        if (evt.target.checked) {
            const defaultSec = initialSeconds || 0;
            const defaultMin = !initialSeconds && !initalMinutes ? 1 : initalMinutes;
            setStartMinutes(defaultMin);
            setStartSeconds(defaultSec);
        } else {
            setStartMinutes(0);
            setStartSeconds(0);
        }
    }

    const handleMinChange = (evt) => {
        setStartMinutes(evt.target.value);
    }

    const handleSecChange = (evt) => {
        setStartSeconds(evt.target.value);
    }
    
    const submitEdits = () => {
        setInitialTime(startMinutes * 60000 + startSeconds * 1000);
        toggleEditTimer();
    }

    return (
        <div className="EditTimer">
            <input type="checkbox" id="countdown" checked={timerType==='count-down'} onChange={handleCheckChange} />
            <label htmlFor="countdown">Countdown Timer</label>
            {timerType === 'count-down' ? 
                <div className="EditTimer-select">
                    <select onChange={handleMinChange} value={startMinutes}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    :
                    <select onChange={handleSecChange} value={startSeconds}>
                        <option value="0">00</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                    </select>
                </div>
            :  
                <h1>{'00:00'}</h1>
            }
            <input type="checkbox" id="five-sec" checked={fiveSec} onChange={evt => setFiveSec(evt.target.checked)} />
            <label htmlFor="five-sec">5 sec count</label>
            <div className="EditTimer-icons">   
                <div className="EditTimer-icon">                    
                    <FontAwesomeIcon icon={faCheckSquare} onClick={submitEdits} />
                </div>
            </div>
        </div>
    )
}

export default EditTimer;
