import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../store/users'









function MyPeeps() {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.fetchUsers)
  
  useEffect(() =>{
    dispatch(fetchUsers())
  }, [dispatch])
  
 

  
  return (
    <div className='body'>
        <h1 className='rotate'>My Peeps..</h1>
     
    </div>
  )
}

export default MyPeeps
