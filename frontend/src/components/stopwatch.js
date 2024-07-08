import React, { useRef, useEffect, useState} from 'react'
import { useExperiment } from '../context/experimentContext'

function Stopwatch () {
    const { activeExperiment, paused, selectedDot } = useExperiment();
    const [elapsedTime, setElapsedTime] = useState(0)
    const intervalIdRef = useRef(null)
    const startTimeRef = useRef(0)

    useEffect(() => {
        if (!activeExperiment) setElapsedTime(0)
        if (activeExperiment && !paused && selectedDot == null) {
            startTimeRef.current = Date.now() - elapsedTime;
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            clearInterval(intervalIdRef.current);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        };
    }, [activeExperiment, paused, selectedDot]);

    function formatTime(){
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60)
        let seconds = Math.floor(elapsedTime / (1000) % 60)
        let milliseconds = Math.floor((elapsedTime % 1000) / 10)

        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        milliseconds = String(milliseconds).padStart(2, '0');

        return `${minutes}:${seconds}:${milliseconds}`
    }

    return (
        <div className = "stopwatch">{formatTime()}</div>
    )
}

export default Stopwatch