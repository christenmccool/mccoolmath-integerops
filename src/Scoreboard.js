import React, {useContext} from 'react';
import ScoreContext from './ScoreContext';
import './Scoreboard.css';

const Scoreboard = ({op}) => {

    const {scores, setScores} = useContext(ScoreContext);

    console.log(scores);

    return (
        <div className="Scoreboard">
            <div className="Scoreboard-score">
                <p>Correct: {scores[op]["correct"]}</p>
            </div>
            <div className="Scoreboard-score">
                <p>Total: {scores[op]["attempted"]}</p>
            </div>
        </div>
        
    )
}

export default Scoreboard;