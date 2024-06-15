import React, { useRef, useEffect, useState } from 'react'
import Dot from '../components/dot'
import Stopwatch from '../components/stopwatch'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'

function Game() {
    const { activeExperiment, startExperiment, resetExperiment, paused, pause, unpause } = useExperiment()
    const [dots, setDots] = useState([])

    const startendExperiment = () => {
        console.log(activeExperiment)
        if (activeExperiment) { // Stop experiment
            setDots([])
            resetExperiment()
            pause()
            
        }
        else { // Start experiment
            placeDots()
            startExperiment()
            unpause()
            
        }
    }

    const placeDots = () => {
        const newDots = Array.from({ length: 4 }).map((_, index) => (
          <Dot/>
        ));
        setDots(newDots)
    };

    // detect space bar
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === ' ' && activeExperiment) {
            pause()
            console.log(event.key)
          }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, [activeExperiment]);


    return (
        <div>
            <nav className="navbar">
                <button className="experiment-button" onClick = {startendExperiment}
                 style = {{backgroundColor: activeExperiment ? 'red' : 'green'}}>
                    {activeExperiment ? 'End Experiment' : 'Start Experiment'}
                </button>
                <div className="stopwatch">
                    Timer: {<Stopwatch/>}
                </div>
            </nav>

            <div>
                {dots}
            </div>
        </div>
    );
  }

export default Game