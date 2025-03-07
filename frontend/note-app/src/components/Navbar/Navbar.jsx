import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import SearchBar from '../SearchBar/SearchBar'
import {useNavigate} from "react-router-dom"

const Navbar = ({userInfo}) => {

const [searchQuery, setSearchQuery] = useState('')
const navigate = useNavigate()

const onLogout = ()=>{
  localStorage.clear()
  navigate('/login')
}
const handleSearch = () =>{
  
}

const onClearSearch = ()=>{
  setSearchQuery('')
}
  console.log('Nav', userInfo)
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 shadow-sm'>
      <h2 className='text-lg font-medium text-black py-2'>Notes</h2>
      <div className={`flex justify-between ${userInfo ? 'w-120' : ''} mr-5`}>
        <SearchBar 
          value={searchQuery}
          onChange={({target})=>{setSearchQuery(target.value)}}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
      </div>
    </div>
  )
}

export default Navbar