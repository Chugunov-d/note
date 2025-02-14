import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'

export const Home = () => {
  return (
    <>
      <Navbar/>
        <div className='grid grid-cols-4  gap-4 m-8'>
          <div className='container mx-auto w-100'>
            <NoteCard 
              title='Meet'
              date='3rd April 2024' 
              content='sddddddddd dddddddddddddddd dddddddddd'
              tags='#Meeting'
              isPinned={true}
              onEdit={()=>{}}  
              onDelete={()=>{}}
              onPinNote={()=>{}}    
            />
          </div>         
       </div>

       <button className='w-16 h-16 flex  items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10'>
        <MdAdd  className="text-[32px] text-white"/>
       </button>

       <AddEditNotes/>
    </>
  )
}

export default Home
