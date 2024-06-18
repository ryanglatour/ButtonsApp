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
        // Create area and calculate positions
        const windowCenterX = window.innerWidth / 2
        const windowCenterY = window.innerHeight / 2
        const dotPositions = [];
        dotPositions.push({positionX: windowCenterX + 100, positionY: windowCenterY + 100, correct: false})
        dotPositions.push({positionX: windowCenterX + 100, positionY: windowCenterY - 100, correct: false}) // This one
        dotPositions.push({positionX: windowCenterX - 10, positionY: windowCenterY + 10, correct: false})
        dotPositions.push({positionX: windowCenterX - 150, positionY: windowCenterY - 150, correct: false})

        let closestDot = 0
        let closestDistance = 100000
        dotPositions.forEach ((dot, index) => {
            let distance = Math.sqrt(
                Math.pow(dot.positionX - windowCenterX, 2) + Math.pow(dot.positionY - windowCenterY, 2)
            );
            if (distance < closestDistance) {
                closestDot = index
                closestDistance = distance
            }
        })

        dotPositions[closestDot].correct = true
        
        console.log(dotPositions)
        
      
        

        const newDots = dotPositions.map((pos, index) => (
          <Dot 
            key = {index}
            positionX = {pos.positionX}
            positionY = {pos.positionY}
            correct = {pos.correct}
            onClick={() => dotClicked(pos.correct)}
          />
        ))
        setDots(newDots)
    }

    const dotClicked = (correct) => {
        
        console.log(correct)
    }

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