import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

export const Home = () => {


  const [openAddEditModal,setOpenAddEditModal] = useState({
    isShown:false,
    type: 'add',
    data: null,
  })

  const [userInfo, setUserInfo] = useState(null)

  const navigate = useNavigate()

  const getUserInfo = async () =>{
    try {
      const response = await axiosInstance.get("/profile")
      console.log(response.data)
      if (response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401){
        localStorage.clear()
        navigate("/login")
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {
    }
  }, [])
  console.log('Home', userInfo)
  console.log('Home_name', userInfo?.full_name)

  return (
    <>
      <Navbar userInfo={userInfo}/>
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

       <button className='w-16 h-16 flex  items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={()=>{
          setOpenAddEditModal({isShown:true, type:'add', data:null})
        }}
       >
        <MdAdd  className="text-[32px] text-white"/>
       </button>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose = {()=>{}}
          style={{
            overlay:{
              backgroundColor:'rgba(0,0,0,0.2)',
            },
          }}
          contentLabel=''
          className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden'
        
        >

        <AddEditNotes type={openAddEditModal.type} noteData={openAddEditModal.data} onClose={()=>{setOpenAddEditModal({isShown:false, type:'add', data:null})}}/>
        </Modal>
       
       
    </>
  )
}

export default Home
