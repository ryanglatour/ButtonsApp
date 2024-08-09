import React, { useState } from 'react'

const Survey = ({onClick, onNext}) => {
    const [selected, setSelected] = useState(null);

    const handleClick = (value) => {
        setSelected(value);
        onClick(value);
    };

    const handleNext = () => {
        onNext()
    }

    return (
        <div className="survey-container">
            <h3>How confident are you in the correctness of your answer?</h3>
            <div className="button-group">
                <div className="button-wrapper">
                    <button 
                        className={`survey-button ${selected === 1 ? 'selected' : ''}`} 
                        onClick={() => handleClick(1)}
                    >
                        1
                    </button>
                    <label>Certainly wrong</label>
                </div>
                <div className="button-wrapper">
                    <button 
                        className={`survey-button ${selected === 2 ? 'selected' : ''}`} 
                        onClick={() => handleClick(2)}
                    >
                        2
                    </button>
                    <label>Probably wrong</label>
                </div>
                <div className="button-wrapper">
                    <button 
                        className={`survey-button ${selected === 3 ? 'selected' : ''}`} 
                        onClick={() => handleClick(3)}
                    >
                        3
                    </button>
                    <label>Unsure</label>
                </div>
                <div className="button-wrapper">
                    <button 
                        className={`survey-button ${selected === 4 ? 'selected' : ''}`} 
                        onClick={() => handleClick(4)}
                    >
                        4
                    </button>
                    <label>Probably right</label>
                </div>
                <div className="button-wrapper">
                    <button 
                        className={`survey-button ${selected === 5 ? 'selected' : ''}`} 
                        onClick={() => handleClick(5)}
                    >
                        5
                    </button>
                    <label>Certainly right</label>
                </div>
            </div>

            {process.env.REACT_APP_TOUCHSCREEN === 'false' && <button className='survey-next-button'
                onClick={()=> handleNext()}>Next</button>}
        </div>
    )
}

export default Survey