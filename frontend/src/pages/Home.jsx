import { useState, useEffect } from 'react'
import { quotes } from '../components/justSaying'
import './Home.css'
import ChatBox from '../components/ChatBox'
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
    <div className='body'>
      
      <h1 className='rotate'>Franks World</h1>
      <div>
        <h1 className="card">Just sayin... <div>{quotes[index]}</div></h1>
      </div>
      <ChatBox />
    </div>
  )
}

export default Home
