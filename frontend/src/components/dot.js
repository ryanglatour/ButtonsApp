import green from '../images/greencircle.png'
import outline from '../images/greencircleoutline.png'
import { useExperiment } from '../context/experimentContext'
import React, { useEffect} from 'react'

const Dot = ({positionX, positionY, correct, index, onClick}) => {
    const { selectedDot, setSelectedDot } = useExperiment()
    
    /*const updateSelection = () => {
        if (selectedDot === null)
            setSelectedDot(index)
    }*/

    return(
        <div>
            <img src={selectedDot === index ? outline : green}
            alt="green" 
            style={{
                position: 'absolute',
                left: `${positionX}px`,
                top: `${positionY}px`,
                height: '50px',
                width: '50px'
              }}
              //onClick={updateSelection}
              />
        </div>
    )
}

export default Dot