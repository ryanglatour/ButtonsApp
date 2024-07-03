import React, { useRef, useEffect, useState } from 'react'
import Dot from '../components/dot'
import Stopwatch from '../components/stopwatch'
import Survey from '../components/survey'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'
import red from '../images/redcircle.png'
import IDModal from '../components/idmodal'

function Game() {
    const { activeExperiment, startExperiment, resetExperiment, paused, pause, unpause, selectedDot, setSelectedDot, id} = useExperiment()
    const [dots, setDots] = useState([])
    const [survey, setSurvey] = useState([])
    const [practice, setPractice] = useState(true)
    const [log, setLog] = useState("")
    const [jsonLog, setJsonLog] = useState([])

    const [timeStart, setTimeStart] = useState(Date.now())
    const [timeSelected, setTimeSelected] = useState(Date.now())
    const [screenTouchLocation, setScreenTouchLocation] = useState([])
    const [timeClickNext1, setTimeClickNext1] = useState(null)
    const [timeSelectConfidence, setTimeSelectConfidence] = useState(null)
    const [timeClickNext2, setTimeClickNext2] = useState(null)
    const [confidenceSelected, setConfidenceSelected] = useState(null)
    const [isCorrect, setIsCorrect] = useState(null)


    const startendExperiment = () => {
        console.log(activeExperiment)
        if (activeExperiment) { // Stop experiment
            if (practice)
              updateLog("end practice")
            else {
              updateLog("end experiment")
              generateReport()
            }
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
            setTimeout(() => {
              placeDots(); // This will trigger the second render and useEffect call
            }, 0); // Setting a timeout with 0 ms delay to ensure the state update is separated
            startExperiment()
            unpause()
            setTimeStart(Date.now())
        }
    }

    const placeDots = () => {
        // Create area and calculate positions
        const windowCenterX = window.innerWidth / 2
        const windowCenterY = window.innerHeight / 2
        const dotPositions = [];
        const dotCount = 5
        
        const radMin = (1/3)
        const radMax = (3/4)
        const uniform = (radMin, radMax) => Math.random() * (radMax - radMin) + radMin;
        const rads = Array.from({ length: dotCount }, () => uniform(4, 10))
        const angStepSize = 2 * Math.PI / dotCount;

        let firstAng;

        if (dotCount % 2 === 0) {
          firstAng = Math.PI / 2 - angStepSize / 2
        } else {
          firstAng = Math.PI / 2
        }

        const angs = Array.from({ length: dotCount }, (_, n) => firstAng + n * angStepSize);
        const pts = rads.map((r, i) => [r * Math.cos(angs[i]), r * Math.sin(angs[i])]);
        const xs = pts.map(pt => pt[0]);
        const ys = pts.map(pt => pt[1]);

        console.log(rads);
        console.log(angs.map(a => a * 180 / Math.PI));

        const offset = (1/70) * Math.sqrt(
            Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
        )
        
        pts.forEach((pt, index) => {
          dotPositions.push({
            positionX: windowCenterX -25 - (xs[index] * offset),//(offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            positionY: windowCenterY -25 - (ys[index] * offset),//(offset * ((Math.random() * (radMax-radMin)) + (radMin))),
            correct: false,
            distance: 0
        })
        })

        let closestDot = 0
        let closestDistance = 100000
        let pointString = ""
        dotPositions.forEach ((dot, index) => {
            pointString += `(${dot.positionX.toFixed(2)}, ${dot.positionY.toFixed(2)}), `
            let distance = Math.sqrt(
                Math.pow(dot.positionX - windowCenterX, 2) + Math.pow(dot.positionY - windowCenterY, 2)
            );
            dotPositions[index].distance = distance
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
            distance = {pos.distance}
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
          setScreenTouchLocation([clickX, clickY])
          setSelectedDot(closestDot.props.index);
          setTimeSelected(Date.now())
          setIsCorrect(closestDot.props.correct)
          //pause()
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
        setConfidenceSelected(answer)
        setTimeSelectConfidence(Date.now())
        updateLog(`user selected confidence ${answer}`)
    }

    // detect space bar
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === ' ' && activeExperiment) {
            if (selectedDot == null) {
              //console.log(selectedDot)
            }
            else if (!paused) {
                setTimeClickNext1(Date.now())
                updateLog("user clicked next")
                pause()
                console.log(dots[selectedDot].props.correct)
                setDots([])
                const survey = <Survey onClick={surveyClicked}/>
                setSurvey(survey)
                
            }
            else {
                setTimeClickNext2(Date.now())
                updateLog("user clicked next")
                unpause()
                setTimeout(() => {
                  placeDots(1); // This will trigger the second render and useEffect call
                }, 0); // Setting a timeout with 0 ms delay to ensure the state update is separated
                setSurvey([])
                setSelectedDot(null)
                setIsCorrect(null)
            }
            
          }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, [activeExperiment, paused, selectedDot]);



      const handleAddJsonObject = (message) => {
        let randomPoints = []
        let distances = []
        dots.forEach ((dot, index) => {
          randomPoints.push([parseFloat(dot.props.positionX.toFixed(2)), parseFloat(dot.props.positionY.toFixed(2))])
          distances.push(parseFloat(dot.props.distance.toFixed(2)))
        })
        
        randomPoints.slice(0, -2)
  
        const newObject = {
          message: message,
          userID: id,
          currentPhase: practice ? "practice" : "experiment",
          timeStart: timeStart,
          randomPoints: randomPoints,
          randomPointDists: distances,
          timeSelectPoint: timeSelected,
          screenTouchLocation: screenTouchLocation,
          pointSelected: selectedDot,
          isCorrect: isCorrect,
          timeClickNext1: timeClickNext1,
          timeSelectConfidence: timeSelectConfidence,
          confidenceSelected: confidenceSelected,
          timeClickNext2: timeClickNext2
        }
        setJsonLog((prevObjects) => [...prevObjects, newObject])
      };

      // JSON use effects
      useEffect(() => {
        if(log !== "") handleAddJsonObject(log.substring(log.lastIndexOf("<")))
      }, [log])


      const updateLog = (line) => {
        setLog((prevLog) => prevLog + `<${Date.now()}> ` + line + "\n")
      }

      const generateReport = () => {
        const blob = new Blob([log], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")

        link.download = `${Date.now()}.txt`
        link.href = url
        link.click()

        const jsonString = JSON.stringify(jsonLog, null, 2)
        const jsonBlob = new Blob([jsonString], { type: 'application/json' })
        const jsonUrl = URL.createObjectURL(jsonBlob)
        const jsonLink = document.createElement('a')
        jsonLink.download = `${Date.now()}.json`
        jsonLink.href = jsonUrl
        jsonLink.click()
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
                <IDModal></IDModal>
            </div>
        </div>
    );
  }
//<IDModal></IDModal>
export default Game