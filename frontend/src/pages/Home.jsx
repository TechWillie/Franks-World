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
      
      <h1 className='header'>What&apos;s going on...<br></br> What&apos;s fuss about..?</h1>
      <div className='quotes-container'>
        <h3 className="intro">Just sayin... </h3>
          <div className='quotes'><h1>{quotes[index]}</h1></div>
      </div>
    </div>
  )
}

export default Home
