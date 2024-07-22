import React, { useRef, useEffect, useState } from 'react'
import Dot from '../components/dot'
import { useNavigate } from "react-router-dom"

function Calibrate () {
    const navigate = useNavigate()

    const [dots, setDots] = useState([])

    const [calibratedDots, setCalibratedDots] = useState(["corner", "edges", "center", "middlish"])

    const [next, setNext] = useState(0)

    const selectDots = () => {
        const bottomOfScreen = window.innerHeight - 50
        const rightOfScreen = window.innerWidth - 50

        const centerXOfScreen = (window.innerWidth / 2) - 50
        const centerYOfScreen = (window.innerHeight / 2) - 50

        const xFourth = (window.innerWidth / 4)
        const yFourth = (window.innerHeight / 4)

        const index = Math.floor(Math.random() * calibratedDots.length)
        const setOfDots = calibratedDots[index]

        // Delete current dot type from array
        const dup = [...calibratedDots]
        dup.splice(index, 1)
        setCalibratedDots(dup)

        let dotArray = []
        if (setOfDots === "corner")
            dotArray = [[0, 0], [rightOfScreen, 0], [0, bottomOfScreen], [rightOfScreen, bottomOfScreen]]
        else if (setOfDots === "edges")
            dotArray = [[0, centerYOfScreen], [centerXOfScreen, 0], [rightOfScreen, centerYOfScreen], [centerXOfScreen, bottomOfScreen]]
        else if (setOfDots === "middlish")
            dotArray = [[xFourth, yFourth], [3 * xFourth, yFourth], [xFourth, 3 * yFourth], [3 * xFourth, 3 * yFourth]]
        else
            dotArray = [[centerXOfScreen, centerYOfScreen]]
        


        const randomCoordinates = dotArray[(Math.floor(Math.random() * dotArray.length))]

        const dot = <Dot
            positionX = {randomCoordinates[0]}
            positionY = {randomCoordinates[1]}
            onClick = {() => setNext(next + 1)}
        />
        setDots(dot)
        /*const dots = dotArray.map((dot, index) => (
           <Dot
            positionX = {dotArray[index][0]}
            positionY = {dotArray[index][1]}
            onClick = {() => setNext(next + 1)}
           /> 
        ))
        setDots(dots)*/
    }

    const placeDot = (coordArray) => {
        
    }

    useEffect(() => {
        if (next > 3) navigate("/game")
        selectDots()
      }, [next])

      useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "scroll"
        };
    }, []);
    

    return (
        <div>
            
            {dots}
        </div>
    )
}

export default Calibrate