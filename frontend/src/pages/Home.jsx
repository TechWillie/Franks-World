import { useState, useEffect } from 'react'
// import { quotes } from '../components/justSaying'
import './Home.css'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { fetchChatboardThunk } from '../store/chatboard'
import CreateEventModal from '../components/CreateEventsModal'
import CreateChatboardModal from '../components/CreateChatterModal'
import { fetchEventsThunk } from '../store/events'
import { fetchMediaThunk } from '../store/media'
// import UploadFile from "../components/UploadFile";
import logo from "../assets/media/pictures/frankslogo.png"


 


function Home() {

   const store = useStore();
  const sessionFromSelector = useSelector((state) => state.session?.user);

  useEffect(() => {
    console.log("🧠 selector session.user:", sessionFromSelector);
    console.log("🏪 store.getState().session.user:", store.getState().session?.user);
    console.log("🏪 store object identity:", store);
  }, [sessionFromSelector, store]);

  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
 
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

  const photo = sessionUser?.photo?.trim();

  return (
    <div className='home-box'>
      <div className='event-container'>
        <h1>Most Current Events</h1>
         {sortedEvents.map((event) => (
          <div key={event.id} >
            <h3>{event.name}</h3>
            <p>Created: {event?.createdAt}</p>
            
          </div>
        ))}
      </div>
      <div className='session'>
      {!sessionUser ? (
        <div>
          <h1>Welcome to theHype...!</h1>
          <h3>Look around... Become a member...</h3>
        </div>) : (
        <div>
          <h1>Welcome, {sessionUser.username}!</h1>
          <img
            className="propic"
            key={photo || "default"}
            src={photo ? `${photo}` : {logo} }
            alt="profile"
            onError={(e) => {
              console.error("❌ image failed:", photo);
              e.currentTarget.src = logo;
            }}
          />


          
          {Object.values(mediaObj).map((media) => (
            <div key={media.id}>
              {media.type === 'image' && sessionUser.id === media.userId && (
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
          {sessionUser && 
            <>
            <h1>Your Events</h1>
            
            {eventsArr.filter(event => event.hostId === sessionUser.id)
                      .map((event) => (
              
              <div key={event.id} className="user-event-card">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>{event.eventDate}</p>
              </div>
            ))}
            </>
          }
            
        </>
      </div>
   </div>
  )
}
export default Home
