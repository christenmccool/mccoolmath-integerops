import React, {useState} from 'react';
import ScoreContext from './ScoreContext';
import Routes  from './Routes';
import NavBar from './NavBar';

function App() {
    const [scores, setScores] = useState({
                                            add: {correct: 0, incorrect: 0, attempted: 0}, 
                                            sub: {correct: 0, incorrect: 0, attempted: 0},
                                            mult: {correct: 0, incorrect: 0, attempted: 0},
                                            div: {correct: 0, incorrect: 0, attempted: 0},
                                            mix: {correct: 0, incorrect: 0, attempted: 0}
                                        });

    return (
        <ScoreContext.Provider value={{scores, setScores}}>
            <div className="App">
                <NavBar />
                <Routes />
            </div>
        </ScoreContext.Provider>
    );
}

export default App;
