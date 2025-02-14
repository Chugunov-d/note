import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import PasswordInput from '../../components/Input/PasswordInput'

const SighUp = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSighUp = async (e) => {
    e.preventDefault();
    
    if (!name){
      setError('Please enter your name')
      return
    }
    if (validateEmail(email)){
      setError('Please enter valid email address')
      return
    }

    if (!password){
      setError('Please enter the password')
      return
    }

    setError('')

    //sighup api call
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

                <PasswordInput 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}    
                />
                {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                <button type='submit' className='btn-primary'>Create Account</button>
                <p className='text-sm text-center mt-4'>
                    Already have an account?{' '}
                    <Link to='/login' className='font-medium text-blue-600 underline'>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    </div>
    </>
  )
}

export default SighUp