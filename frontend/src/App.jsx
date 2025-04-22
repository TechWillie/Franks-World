import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import mypic from '../../../backend/media/pictures/me-standing.jpg';
import { quotes } from './justSaying'

function App() {
  const [index, setIndex] = useState(0)

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setIndex(randomIndex)
  }

  return (
    <div className='body'>
      
      <h1 className='rotate'>Franks World</h1>
      <div>
      <button className="card" onClick={handleClick}>
          Just sayin... {quotes[index]}
        </button>
       
      </div>
      
    </div>
  )
}

export default App
