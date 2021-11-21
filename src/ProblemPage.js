import React from 'react';
import Scoreboard from './Scoreboard';
import Problem from './Problem';
import TimerWrapper from './TimerWrapper';
import './ProblemPage.css';

const ProblemPage = ({op}) => {

    return (
        <div className="ProblemPage"> 

            <div className="ProblemPage-main">
                <Problem op={op} />
            </div>

            <div className="ProblemPage-info">
                <div className="ProblemPage-statistics">
                    <Scoreboard op={op} />
                </div>

                <div className="ProblemPage-timer">
                    <TimerWrapper />
                </div>
            </div>
        </div>
    )
}

export default ProblemPage;