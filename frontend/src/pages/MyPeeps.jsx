import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../store/users'
import './MyPeeps.css'
import { fetchMediaThunk } from '../store/media'


function MyPeeps() {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.allUsers)
  const media = useSelector(state => state.media || {})

  useEffect(() =>{
    dispatch(fetchUsers())
    dispatch(fetchMediaThunk())
  }, [dispatch])
  // console.log('Users array:', users);

  const mediaArr = Object.values(media)
  console.log("⚠️⚠️Merdia array :" , media);
  
  

  return (
  <div className="page-body">
    <div className="peeps">
      {users.map((user) => {
        const userEventPics = mediaArr.filter(
          (pic) => pic.eventId && Number(pic.userId) === Number(user.id)
        );

        return (
          <div key={user.id} className="peep">
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <p>{user.bio || "No Bio..."}</p>

            {/* profile photo */}
            <img src={user.photo} alt={user.username} />

            {/* event pics */}
            <div className="event-pics">
              {userEventPics.length ? (
                userEventPics.slice(0, 3).map((pic) => (
                  <img className='pic' key={pic.id || pic.url} src={pic.url} alt="Event" />
                ))
              ) : (
                <span>No event pics yet...</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

}

export default MyPeeps
