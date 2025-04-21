import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import mypic from '../../../backend/media/pictures/me-standing.jpg';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='frontPage'>
      <div>
        
          {/* <img src="../public/media/pictures/me-standing.jpg" className="logo" alt="Vite logo" /> */}
      
        <a href="www.rapid-exposure.com" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Franks world</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
