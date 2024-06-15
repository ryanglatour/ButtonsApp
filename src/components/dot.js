import green from '../images/greencircle.png'
const Dot = ({height, width}) => {

    return(
        <div>
            <img src={green} alt="green" 
            style={{
                position: 'absolute',
                left: (window.innerWidth / 4) + (Math.floor(Math.random() * (window.innerWidth - 50)) / 2),
                top: Math.floor(Math.random() * (window.innerHeight - 50)),
                height: '40px',
                width: '40px'
              }}
              />
        </div>
    )
}

export default Dot