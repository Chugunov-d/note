import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex justify-center items-center flex-col mt-40'>
        <img src={imgSrc} alt="No notes" className='w-60' />

        <p className='w-1/2 text-2xl font-bold text-slate-700 text-center leading-7 mt-5'>
        {message}
        </p>
    </div>
  )
}

export default EmptyCard