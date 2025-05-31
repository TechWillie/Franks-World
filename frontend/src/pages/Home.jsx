import { useState, useEffect } from 'react'
import { quotes } from '../components/justSaying'
import './Home.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChatboardThunk } from '../store/chatboard'




function Home() {
  const dispatch = useDispatch()
  const [index, setIndex] = useState(0)
  const mesageBoards = useSelector(state => state.chatboard)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    }, 5000) // every 3 seconds
    return () => clearInterval(interval) // cleanup on unmount
  }, [])


  useEffect(() => {
    dispatch(fetchChatboardThunk());
    console.log("charboards 1:", mesageBoards)
}, []);

  useEffect(() => {
  console.log("chatboards 2:", mesageBoards);
}, [mesageBoards]);
  
  return (
    <>
    <div className='home-body'>
      <h1 className='header'>What&apos;s going on...<br></br> What&apos;s fuss about..?</h1>
      <div className='quotes-container'>
        <h3 className="intro">Just sayin... </h3>
          <div className='quotes'><h1>{quotes[index]}</h1></div>
      </div>
    </div>
    <div className='chatboard-container'>
      {mesageBoards.map((messageBoard) => (
        <div key={messageBoard.id} className="message-container">
          <h3>{messageBoard.content}</h3>
          <p>{messageBoard.createdAt}</p>
        </div>
      ))}
      </div>
    </>
  )
}
export default Home
