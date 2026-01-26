import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../store/users'
import './MyPeeps.css'

function MyPeeps() {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.allUsers)
  
  useEffect(() =>{
    dispatch(fetchUsers())
  }, [dispatch])
  console.log('Users array:', users);
  return (
    <div className='body'>
        <h1 className='header'>My Peeps..</h1>
        <div className='peeps'>
          {users.map(user => (
            <div key={user.id} className='peep'>
              {console.log(user)}
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <p>{user.bio || "No Bio..."}</p>
              <img src={user.photo} alt="" />
            </div>
          ))}
        </div>
    </div>
  )
}

export default MyPeeps
