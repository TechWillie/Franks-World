import { useState, useEffect } from 'react'
// import { quotes } from '../components/justSaying'
import './Home.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChatboardThunk } from '../store/chatboard'
import CreateEventModal from '../components/CreateEventsModal'
import CreateChatboardModal from '../components/CreateChatterModal'
import { fetchEventsThunk } from '../store/events'
import { fetchMediaThunk } from '../store/media'



function Home() {
  const dispatch = useDispatch()
  const sesUser = useSelector(state => state.session.user)
  const eventsObj = useSelector(state => state.events || [])
  const mediaObj = useSelector(state => state.media || {})
  // const [index, setIndex] = useState(0)
  const [createEventsModal, setCreateEventsModal] = useState(false)
  const [createChatModal, setCreateChatModal] = useState(false)
  const eventsArr = Object.values(eventsObj)
  const sortedEvents = Object.values(eventsArr).sort((a, b) => {
  return new Date(b.createdAt) - new Date(a.createdAt);
});
 
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndex((prevIndex) => (prevIndex + 1) % quotes.length)
  //   }, 5000) // every 3 seconds
  //   return () => clearInterval(interval) // cleanup on unmount
  // }, [])


  useEffect(() => {
    dispatch(fetchChatboardThunk());
    dispatch(fetchEventsThunk());
    dispatch(fetchMediaThunk());
  }, [dispatch]);

  
  const clickOnEvents = () => {
    console.log("clicked on events", eventsArr)
    setCreateEventsModal(true)
  }

  const clickOnChatters = () => {
    console.log("clicked on chatters")
    setCreateChatModal(true)
  }

  return (
    <div className='home-box'>
      {/* <div className='quotes-container'>
        <h3 className="intro">Just sayin... </h3>
          <div className='quotes'><h1>{quotes[index]}</h1></div>
      </div> */}
      <div className='event-container'>
        <h1>Most Current Events</h1>
        {/* {eventsArr.map((event) => ( */}
         {sortedEvents.map((event) => (
          <div key={event.id} >
            <h3>{event.name}</h3>
            <p>Created: {event?.createdAt}</p>
            
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
          {Object.values(mediaObj).map((media) => (
            <div key={media.id}>
              {media.type === 'image' && sesUser.id === media.userId && (
                <img src={media.url} alt={media.name} className='pic' />
              )}
            </div>
          ))}
          <button type='button' onClick={clickOnEvents}>Create Event</button>
          {createEventsModal && <CreateEventModal onClose={() => setCreateEventsModal(false)} />}
          <button type='button' onClick={clickOnChatters} >Create Chatter</button>
          {createChatModal && <CreateChatboardModal onClose={() => setCreateChatModal(false)} />}
        </div>
      )}
        <>
        <h1>Your Events</h1>
          {sesUser && 
            
            eventsArr.filter(event => event.hostId === sesUser.id)
                      .map((event) => (
              <div key={event.id} className="user-event-card">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>{event.eventDate}</p>
                
              </div>
            ))}
            
        </>
      </div>
   </div>
  )
}
export default Home
