import React, { useRef, useEffect, useState } from 'react'
import Dot from '../components/dot'
import Stopwatch from '../components/stopwatch'
import Survey from '../components/survey'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'
import red from '../images/redcircle.png'
import { useNavigate } from "react-router-dom"

function Game() {
    const { activeExperiment, startExperiment, resetExperiment,
      paused, pause, unpause,
      selectedDot, setSelectedDot, id,
      trials, trialSet, time, timeSet, correct, correctSet} = useExperiment()
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
    const [done, setDone] = useState(false)

    const navigate = useNavigate()

    //console.log(process.env.REACT_APP_API_URL)

    const startendExperiment = () => {
        //console.log(activeExperiment)
        if (activeExperiment) { // Stop experiment
            if (practice) {
              updateLog("end practice")
            }
            else {
              updateLog("end experiment")
              
              timeSet(timeSelected - timeStart)
              
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
              placeDots(); // This will run on next even loop
            }, 0);
            startExperiment()
            unpause()
            setTimeStart(Date.now())
            trialSet(0)
        }
    }

    const placeDots = () => {
        // Create area and calculate positions
        const windowCenterX = window.innerWidth / 2
        const windowCenterY = window.innerHeight / 3
        const dotPositions = [];
        const dotCount = process.env.REACT_APP_DOTS || 5
        
        const radMin = eval(process.env.REACT_APP_RAD_MIN)
        const radMax = eval(process.env.REACT_APP_RAD_MAX)
        
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

        //console.log(rads);
        //console.log(angs.map(a => a * 180 / Math.PI));

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
            pointString += `(${xs[index].toFixed(2)}, ${ys[index].toFixed(2)}), `
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
        
        //console.log(dotPositions)
        
        const newDots = dotPositions.map((pos, index) => (
          <Dot 
            key = {index}
            positionX = {pos.positionX}
            positionY = {pos.positionY}
            correct = {pos.correct}
            distance = {pos.distance}
            index = {index}
            calcX = {xs[index]}
            calcY = {ys[index]}
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

        //if (clickY < 75) return
    
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
          //if (!practice) { 
            trialSet(trials + 1)
            if (closestDot.props.correct && !practice) correctSet(correct + 1)
          //}
        }
      };

      useEffect(() => {
        if (activeExperiment) {
          window.addEventListener('click', handleCanvasClick);
          window.addEventListener('touchstart', handleCanvasClick)
        }
        return () => {
          window.removeEventListener('click', handleCanvasClick);
          window.removeEventListener('touchstart', handleCanvasClick)
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
                if (process.env.REACT_APP_TOUCHSCREEN === 'true') firstNext()
            }
            else if (confidenceSelected != null) {
                //console.log(confidenceSelected)
                if (process.env.REACT_APP_TOUCHSCREEN === 'true') secondNext()
                setConfidenceSelected(null)
            }
            
          }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, [activeExperiment, paused, selectedDot, confidenceSelected]);

      const firstNext = () => {
          setTimeClickNext1(Date.now())
          updateLog("user clicked next")
          pause()
          //console.log(dots[selectedDot].props.correct)
          setDots([])
          const survey = <Survey onClick={surveyClicked} onNext={secondNext}/>
          setSurvey(survey)
      }

      const secondNext = () => {
                setTimeClickNext2(Date.now())
              
                updateLog("user clicked next")
                unpause()

                setSurvey([])
                setSelectedDot(null)
                setIsCorrect(null)

                // Handle trial limit
                //console.log(practice + " " + activeExperiment + " " + trials + " " + process.env.REACT_APP_MAX_NUMBER_PRACTICE)
                if (practice && trials >= process.env.REACT_APP_MAX_NUMBER_PRACTICE) startendExperiment()
                else if (!practice && trials >= process.env.REACT_APP_MAX_NUMBER_EXPERIMENT) startendExperiment()
                else {
                  setTimeout(() => {
                    placeDots(); // This will run on next even loop
                  }, 0);
                }
      }


      const handleAddJsonObject = (message) => {
        let randomPoints = []
        let distances = []
        dots.forEach ((dot, index) => {
          randomPoints.push([parseFloat(dot.props.calcX.toFixed(2)), parseFloat(dot.props.calcY.toFixed(2))])
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
        if (message.includes('end experiment')) setDone(true)
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

        const jsonString = JSON.stringify(jsonLog, null, 2)
        const jsonBlob = new Blob([jsonString], { type: 'application/json' })
        
        const test = process.env.REACT_APP_TOUCHSCREEN
        if (process.env.REACT_APP_TOUCHSCREEN === 'false') {
          console.log(true)
          const mouseBlob = new Blob([mouseMovements], {type:"text/plain"})
          uploadFile(mouseBlob, `${Date.now()}mouse.txt`)
        }
        else {
          const touchBlob = new Blob([touchTracking], {type:"text/plain"})
          uploadFile(touchBlob, `${Date.now()}touch.txt`)
        }

        uploadFile(blob, `${Date.now()}.txt`)
        uploadFile(jsonBlob, `${Date.now()}.json`)
      }

      const uploadFile = async (file, fileName) => {
        const formData = new FormData()
        formData.append('file', file, fileName)
        const response = await fetch (`${process.env.REACT_APP_API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        })
      }

      // Generate report when experiment is over
      useEffect(() => {
        if(done) {
          generateReport()
          navigate('/leaderboard')
        }
      }, [done])


      // Mouse tracking
      const [mouseMovements, setMouseMovements] = useState([])
      useEffect(() => {
          const update = (e) => {

            setMouseMovements((prevMovements) =>
              prevMovements + `${Date.now()}: ${e.clientX}, ${e.clientY}\n`
            )

          }
          window.addEventListener('mousemove', update)
          return () => {
            window.removeEventListener('mousemove', update)
          }
        },
        []
      )

    // Touch tracking
    const [touchTracking, setTouchTracking] = useState([])
    useEffect(() => {
        const update = (e) => {
          const touch = e.touches[0]

          setTouchTracking((prevTouches) =>
            prevTouches + `${Date.now()}: ${touch.clientX}, ${touch.clientY}\n`
          )

        }
        window.addEventListener('touchstart', update)
        return () => {
          window.removeEventListener('touchstart', update)
        }
      },
      []
    )



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
                    top: `${(window.innerHeight / 3) - 25}px`,
                    height: '50px',
                    width: '50px'
                  }}
                  />}
                {process.env.REACT_APP_TOUCHSCREEN === 'false' && selectedDot != null && !paused && <button className='game-next-button'
                onClick={()=> firstNext()}>Next</button>}
                {dots}
                {survey}
            </div>
        </div>
    );
  }
//<IDModal></IDModal>
export default Game