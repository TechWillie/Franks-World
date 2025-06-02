import { useState, useEffect } from 'react'
import { quotes } from '../components/justSaying'
import './Home.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChatboardThunk } from '../store/chatboard'
import pic from "../assets/media/pictures/globe1.avif"


function Home() {
  const dispatch = useDispatch()
  const sesUser = useSelector(state => state.session.user)
  const [index, setIndex] = useState(0)
  const mesageBoards = useSelector(state => state.chatboard || [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    }, 5000) // every 3 seconds
    return () => clearInterval(interval) // cleanup on unmount
  }, [])


  useEffect(() => {
    dispatch(fetchChatboardThunk());
  }, [dispatch]);

  useEffect(() => {
    console.log("user info:", sesUser)
  }, [sesUser]);
  
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
      <h1>Message Boards</h1>
      {mesageBoards.map((messageBoard) => (
        <div key={messageBoard.id} className="message-container">
          <h3>{messageBoard.name}</h3>
          <p>{messageBoard.createdAt}</p>
        </div>
      ))}
      </div>
      <div className='session'>
      {!sesUser ? (
        <div>
          <h1>Welcome, Guest!</h1>
        </div>) : (
        <div>
          <h1>Welcome, {sesUser.username}!</h1>
          <img className='pic' src={pic} alt="" />
        </div>
      )}
      </div>
    </>
  )
}
export default Home
