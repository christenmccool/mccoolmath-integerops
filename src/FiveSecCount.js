import React from 'react';
import './FiveSecCount.css'

const FiveSecCount = ({initialTime, time, fiveSecTime}) => {

    return (
        <div className="FiveSecCount">
            <div className="FiveSecCount-text">
                {fiveSecTime===0 && time===initialTime ? "Go!" : fiveSecTime}
            </div>
        </div>  
    )
}

export default FiveSecCount;


