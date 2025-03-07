import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({userInfo, onLogout}) => {
  console.log('userInfo', userInfo?.full_name)
  return (
    userInfo && (
    <div className='flex item-center gap-3'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>{getInitials(userInfo?.full_name)}</div>
        <div>
            <p className='text-sm font-medium'>{userInfo?.full_name}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
)
}

export default ProfileInfo