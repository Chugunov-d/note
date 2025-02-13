import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'



const SighUp = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSighUp = async (e) => {
    e.preventDefault(); 
  }

  return (
    <>
    <Navbar/>
    <div className='flex item-center justify-center mt-28'>
        <div className='w-98 border rounded bg-white px-7 py-10'>
            <form onSubmit={handleSighUp}>
                <h4 className='text-2xl mb-7'>SighUp</h4>
                <input 
                    type="text" 
                    placeholder='Name' 
                    className='input-box' 
                    value={name} 
                    onChange={(event)=>setName(event.target.value)} //event.target ссылка на Input
                />
                <input 
                    type="text" 
                    placeholder='Email' 
                    className='input-box' 
                    value={name} 
                    onChange={(event)=>setEmail(event.target.value)} //event.target ссылка на Input
                />
                
            </form>
        </div>
    </div>
    </>
  )
}

export default SighUp