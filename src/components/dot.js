import green from '../images/greencircle.png'
const Dot = ({positionX, positionY, correct, onClick}) => {

    return(
        <div>
            <img src={green} alt="green" 
            style={{
                position: 'absolute',
                left: `${positionX}px`,
                top: `${positionY}px`,
                height: '40px',
                width: '40px'
              }}
              onClick={onClick}
              />
        </div>
    )
}

export default Dot