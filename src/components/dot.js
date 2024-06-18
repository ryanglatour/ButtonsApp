import green from '../images/greencircle.png'
import outline from '../images/greencircleoutline.png'
import { ExperimentProvider, useExperiment } from '../context/experimentContext'
import React, { useRef, useEffect, useState } from 'react'

const Dot = ({positionX, positionY, correct, index, onClick}) => {
    const { selectedDot } = useExperiment()
    
    useEffect(() => {
        
    
        return () => {
          
        };
      }, [selectedDot]);

    return(
        <div>
            <img src={selectedDot == index ? outline : green}
            alt="green" 
            style={{
                position: 'absolute',
                left: `${positionX}px`,
                top: `${positionY}px`,
                height: '50px',
                width: '50px'
              }}
              onClick={onClick}
              />
        </div>
    )
}

export default Dot