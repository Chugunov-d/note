import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import SearchBar from '../SearchBar/SearchBar'
import {useNavigate} from "react-router-dom"

const Navbar = () => {

const [searchQuery, setSearchQuery] = useState('')
const navigate = useNavigate

const onLogout = ()=>{
  navigate('/login')
}
const handleSearch = () =>{
  
}

const onClearSearch = ()=>{
  setSearchQuery('')
}

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 shadow-sm'>
      <h2 className='text-lg font-medium text-black py-2'>Notes</h2>
      <div className='flex justify-between w-120 mr-5'>
        <SearchBar 
          value={searchQuery}
          onChange={({target})=>{setSearchQuery(target.value)}}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <ProfileInfo onLogout={onLogout}/>
      </div>
      
    </div>

    
  )
}

export default Navbar