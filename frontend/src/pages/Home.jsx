import { useState, useEffect } from 'react'
import { quotes } from '../components/justSaying'
import './Home.css'
// import mypic from '../../../backend/media/pictures/me-standing.jpg';



function Home() {
  // ! Works but refactored for setIntervals
  const [index, setIndex] = useState(0)
  // const handleClick = () => {
  //   const randomIndex = Math.floor(Math.random() * quotes.length)
  //   setIndex(randomIndex)
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    }, 5000) // every 3 seconds

    return () => clearInterval(interval) // cleanup on unmount
  }, [])

  
  return (
    <div className='home-body'>
      
      <h1 className='header'>Franks World</h1>
      <div>
        <h1 className="intro">Just sayin... <div>{quotes[index]}</div></h1>
      </div>
    </div>
  )
}

export default Home
