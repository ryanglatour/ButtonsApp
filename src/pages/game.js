import React, { useRef, useEffect, useState } from 'react'
import Dot from '../components/dot'
import Stopwatch from '../components/stopwatch'
import Survey from '../components/survey'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'
import red from '../images/redcircle.png'

function Game() {
    const { activeExperiment, startExperiment, resetExperiment, paused, pause, unpause, selectedDot, setSelectedDot } = useExperiment()
    const [dots, setDots] = useState([])
    const [survey, setSurvey] = useState([])

    const startendExperiment = () => {
        console.log(activeExperiment)
        if (activeExperiment) { // Stop experiment
            setDots([])
            resetExperiment()
            pause()
            setSurvey([])
            setSelectedDot(null)
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
        

        const radMin = (1/3)
        const radMax = (3/4)
        const offset = (2/10) * Math.sqrt(
            Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
        )
        console.log(offset)
        // Top left
        dotPositions.push({
            positionX: windowCenterX - (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            positionY: windowCenterY - (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            correct: false
        })
        // Top right
        dotPositions.push({
            positionX: windowCenterX + (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            positionY: windowCenterY - (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            correct: false
        })
        // Bottom Left
        dotPositions.push({
            positionX: windowCenterX - (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            positionY: windowCenterY + (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            correct: false
        })
        // Bottom right
        dotPositions.push({
            positionX: windowCenterX + (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            positionY: windowCenterY + (offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            correct: false
        })

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
            index = {index}
            onClick={() => dotClicked(index, pos.correct)}
          />
        ))
        setDots(newDots)
    }

    const dotClicked = (index, correct) => {
        setSelectedDot(index)
        console.log(index + " " + correct)

    }

    const surveyClicked = (answer) => {
        console.log(answer)
    }

    // detect space bar
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === ' ' && activeExperiment) {
            console.log(event.key + " " + paused)
            if (!paused) {
                pause()
                setDots([])
                const survey = <Survey onClick={surveyClicked}/>
                setSurvey(survey)
            }
            else {
                unpause()
                placeDots()
                setSurvey([])
                setSelectedDot(null)
            }
            
          }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, [activeExperiment, paused]);


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
                {!paused && activeExperiment && <img src = {red}
                alt="red" 
                style={{
                    position: 'absolute',
                    left: `${window.innerWidth / 2}px`,
                    top: `${window.innerHeight / 2}px`,
                    height: '50px',
                    width: '50px'
                  }}
                  />}
                {dots}
                {survey}
            </div>
        </div>
    );
  }

export default Game