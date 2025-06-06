import { useState, useEffect } from 'react'
import { quotes } from '../components/justSaying'
import './Home.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChatboardThunk } from '../store/chatboard'
import pic from "../assets/media/pictures/globe1.avif"
import CreateEventModal from '../components/CreateEventsModal'
import { fetchEventsThunk } from '../store/events'


function Home() {
  const dispatch = useDispatch()
  const sesUser = useSelector(state => state.session.user)
  const eventsObj = useSelector(state => state.events || [])
  const mesageBoards = useSelector(state => state.chatboard || [])
  const [index, setIndex] = useState(0)
  const [createEventsModal, setCreateEventsModal] = useState(false)
  const eventsArr = Object.values(eventsObj)
 
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    }, 5000) // every 3 seconds
    return () => clearInterval(interval) // cleanup on unmount
  }, [])


  useEffect(() => {
    dispatch(fetchChatboardThunk());
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  
  const clickOnEvents = () => {
    console.log("clicked on events", eventsArr)
    setCreateEventsModal(true)
  }

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
          <button type='button' onClick={clickOnEvents}>Create Event</button>
          {createEventsModal && <CreateEventModal onClose={() => setCreateEventsModal(false)} />}
          
        </div>
      )}
      </div>
    </>
  )
}
export default Home
