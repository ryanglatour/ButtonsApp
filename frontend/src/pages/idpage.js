import { useNavigate } from "react-router-dom"
import React, { useRef, useEffect, useState } from 'react'
import IDModal from '../components/idmodal'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'

function IDPage () {
    const { id, setId, enterId} = useExperiment()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(process.env.REACT_APP_TOUCHSCREEN)
        if (process.env.REACT_APP_ID_ENABLED === 'false') {
            setId('N/A')
        }
        if (id && process.env.REACT_APP_TOUCHSCREEN === 'true') navigate("/calibrate")
        else if (id) navigate("/game")
      }, [id])

    return (
        <IDModal/>
    )
}

export default IDPage