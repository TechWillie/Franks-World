// import { useState, useEffect } from 'react'
// import { quotes } from '../components/justSaying'
import './Home.css'
import Navbar from '../components/NavBar'
// import mypic from '../../../backend/media/pictures/me-standing.jpg';



function AFewPeople() {
  // ! Works but refactored for setIntervals
  const [index, setIndex] = useState(0)
  // const handleClick = () => {
  //   const randomIndex = Math.floor(Math.random() * quotes.length)
  //   setIndex(randomIndex)
  // }

 

  
  return (
    <div className='body'>
        <Navbar />
        <h1 className='rotate'>My Peeps..</h1>
     
    </div>
  )
}

export default AFewPeople
