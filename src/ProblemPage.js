import React, { useState } from 'react';
import Scoreboard from './Scoreboard';
import Problem from './Problem';
import FiveSecCount from './FiveSecCount';
import TimerWrapper from './TimerWrapper';
import './ProblemPage.css';

const ProblemPage = ({op}) => {

    const [showTimer, setShowTimer] = useState(false);
    const [fiveSec, setFiveSec] = useState(true);
    const [initialTime, setInitialTime] = useState(0);
    const [time, setTime] = useState(0);
    const [runTimer, setRunTimer] = useState(false);
    const [fiveSecTime, setFiveSecTime] = useState(5);

    return (
        <div className="ProblemPage"> 

            {showTimer && fiveSec && !(fiveSecTime===0 && time!==initialTime) ?
                <div className="ProblemPage-countdown">
                    <FiveSecCount 
                        initialTime={initialTime} 
                        time={time}
                        fiveSecTime={fiveSecTime}
                    />
                </div> : null 
            }

            <div className="ProblemPage-main">
                <Problem op={op} />
            </div>

            <div className="ProblemPage-info">
                <div className="ProblemPage-statistics">
                    <Scoreboard op={op} />
                </div>

                <div className="ProblemPage-timer">
                    <TimerWrapper 
                        showTimer={showTimer}
                        setShowTimer={setShowTimer} 
                        initialTime={initialTime} 
                        setInitialTime={setInitialTime} 
                        time={time}
                        setTime={setTime}
                        fiveSec={fiveSec} 
                        setFiveSec={setFiveSec}
                        runTimer={runTimer}
                        setRunTimer={setRunTimer}
                        fiveSecTime={fiveSecTime}
                        setFiveSecTime={setFiveSecTime}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProblemPage;