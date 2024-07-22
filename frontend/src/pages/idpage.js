import { useNavigate } from "react-router-dom"
import React, { useRef, useEffect, useState } from 'react'
import IDModal from '../components/idmodal'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'

function IDPage () {
    const {id} = useExperiment()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) navigate("/calibrate")
      }, [id])

    return (
        <IDModal/>
    )
}

export default IDPage