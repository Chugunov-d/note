import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from 'moment'

export const Home = () => {


  const [openAddEditModal,setOpenAddEditModal] = useState({
    isShown:false,
    type: 'add',
    data: null,
  })

  const [allNotes, setAllNotes] = useState([])

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

  const getAllNotes = async () =>{
    try {
      const response = await axiosInstance.get("/notes")
      console.log(response.data)
      if (response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again")
    }
  }
  
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {
    }
  }, [])

  
  return (
    <>
      <Navbar userInfo={userInfo}/>
        <div className='grid grid-cols-4  gap-4 m-8'>
          {allNotes.map((item, index) => (
                <NoteCard
                  key={item.id} 
                  title={item.title}
                  date={moment(item.createdon).format('Do MMM YYYY')} 
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.ispinned}
                  onEdit={()=>{}}  
                  onDelete={()=>{}}
                  onPinNote={()=>{}}    
                />
              ))}
          {/*<div className='container mx-auto w-100'></div>*/}         
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

        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={()=>{setOpenAddEditModal({isShown:false, type:'add', data:null})}}
          getAllNotes={getAllNotes}
        />
        </Modal>
       
       
    </>
  )
}

export default Home
