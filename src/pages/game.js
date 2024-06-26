import React, { useRef, useEffect, useState } from 'react'
import Dot from '../components/dot'
import Stopwatch from '../components/stopwatch'
import Survey from '../components/survey'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'
import red from '../images/redcircle.png'

function Game() {
    const { activeExperiment, startExperiment, resetExperiment, paused, pause, unpause, selectedDot, setSelectedDot} = useExperiment()
    const [dots, setDots] = useState([])
    const [survey, setSurvey] = useState([])
    const [practice, setPractice] = useState(true)
    const [log, setLog] = useState("")

    const startendExperiment = () => {
        console.log(activeExperiment)
        if (activeExperiment) { // Stop experiment
            if (practice)
              updateLog("end practice")
            else updateLog("end experiment")
            setPractice(false)
            setDots([])
            resetExperiment()
            pause()
            setSurvey([])
            setSelectedDot(null)
            
        }
        else { // Start experiment
            if (practice)
              updateLog("start practice")
            else updateLog("start experiment")
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
        let pointString = ""
        dotPositions.forEach ((dot, index) => {
            pointString += `(${dot.positionX.toFixed(2)}, ${dot.positionY.toFixed(2)}), `
            let distance = Math.sqrt(
                Math.pow(dot.positionX - windowCenterX, 2) + Math.pow(dot.positionY - windowCenterY, 2)
            );
            if (distance < closestDistance) {
                closestDot = index
                closestDistance = distance
            }
        })

        pointString = pointString.slice(0, -2)
        updateLog(`generate random points: ${pointString}`)
        dotPositions[closestDot].correct = true
        
        console.log(dotPositions)
        
        const newDots = dotPositions.map((pos, index) => (
          <Dot 
            key = {index}
            positionX = {pos.positionX}
            positionY = {pos.positionY}
            correct = {pos.correct}
            index = {index}
            //onClick={() => dotClicked(index, pos.correct)}
          />
        ))
        setDots(newDots)
    }

    const handleCanvasClick = (event) => {
        const clickX = event.clientX;
        const clickY = event.clientY;
        let closestDot = null;
        let minDistance = Infinity;

        if (clickY < 75) return
    
        dots.forEach(dot => {
          const dotX = dot.props.positionX + 25; // Adjust for center of the dot
          const dotY = dot.props.positionY + 25; // Adjust for center of the dot
          const distance = Math.sqrt(Math.pow(dotX - clickX, 2) + Math.pow(dotY - clickY, 2));
          if (distance < minDistance) {
            minDistance = distance;
            closestDot = dot;
          }
        });
    
        if (closestDot && selectedDot === null) {
          setSelectedDot(closestDot.props.index);
          updateLog(`user clicked: (${clickX}, ${clickY}), selecting (${closestDot.props.positionX.toFixed(2)}, ${closestDot.props.positionY.toFixed(2)})`)
        }
      };

      useEffect(() => {
        if (activeExperiment) {
          window.addEventListener('click', handleCanvasClick);
        }
        return () => {
          window.removeEventListener('click', handleCanvasClick);
        };
      }, [dots, activeExperiment, selectedDot]);

    const surveyClicked = (answer) => {
        updateLog(`user selected confidence ${answer}`)
    }

    // detect space bar
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === ' ' && activeExperiment) {
            
            if (!paused) {
                pause()
                console.log(dots[selectedDot].props.correct)
                setDots([])
                const survey = <Survey onClick={surveyClicked}/>
                setSurvey(survey)
                
            }
            else {
                updateLog("user clicked next")
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
      }, [activeExperiment, paused, selectedDot]);

      const updateLog = (line) => {
        setLog((prevLog) => prevLog + `<${Date.now()}> ` + line + "\n")
      }

      const generateReport = () => {
        const blob = new Blob([log], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${Date.now()}.txt`;
        link.href = url;
        link.click()
      }
     

    return (
        <div>
            <nav className="navbar">
                <button className="experiment-button" onClick = {startendExperiment}
                 style = {{backgroundColor: activeExperiment ? 'red' : 'green'}}>
                    {(activeExperiment && practice) 
                    ? 'End Practice'
                    : (!activeExperiment && practice) 
                    ? 'Start Practice'
                    : (activeExperiment && !practice)
                    ? 'End Experiment'
                    : 'Start Experiment'
                  }
                </button>
                {!activeExperiment && !practice && <button className="experiment-button" onClick = {generateReport}
                style = {{backgroundColor: 'black', 
                  position: 'absolute',
                  left: '50%', 
                  transform: 'translate(-50%)'}}>
                  Generate Report</button>}

                
                <div className="stopwatch">
                    Timer: {<Stopwatch/>}
                </div>
            </nav>

            <div>
                {!paused && activeExperiment && <img src = {red}
                alt="red" 
                style={{
                    position: 'absolute',
                    left: `${(window.innerWidth / 2) - 25}px`,
                    top: `${(window.innerHeight / 2) - 25}px`,
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