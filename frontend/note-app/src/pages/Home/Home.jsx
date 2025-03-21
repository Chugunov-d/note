import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { data, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import AddNoteImg from '../../assets/images/addNotes.svg';
import NoData from '../../assets/images/noData.svg'
import moment from 'moment'

export const Home = () => {

  const [isSearch, setIsSearch] = useState(false)

  
  const [openAddEditModal,setOpenAddEditModal] = useState({
    isShown:false,
    type: 'add',
    data: null,
  })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown:false,
    message:'',
    type:'add',
  })

  const [allNotes, setAllNotes] = useState([])

  const [userInfo, setUserInfo] = useState(null)

  const navigate = useNavigate()

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown: true, data: noteDetails, type:"edit"})
  }


  const showToastMessage = (message,type) =>{
    setShowToastMsg({
      isShown:true,
      message,
      type
    })
  }


  const handleCloseToast = () =>{
    setShowToastMsg({
      isShown:false,
      message:''
    })
  }

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
  
  const deleteNote = async (data) =>{
    const noteId = data.id;
    try {
      const response = await axiosInstance.delete(`/delete-note/` + noteId);
      console.log('res',response)
      if (response.data && !response.data.error) {
        showToastMessage('Note Deleted Successfully', 'delete')
        getAllNotes()
      }
    } catch (error) {
      if (
        error.response && error.response.data && error.response.data.message
      ) {
        console.log("An unexpected error")
      }
    }
  }

  const updateIsPinned = async (noteData) =>{
    const noteId = noteData.id;
    console.log(noteData)
    try {
      const response = await axiosInstance.patch(`/update-note-pinned/` + noteId,{
        "isPinned": !noteData.ispinned
      });
      console.log(response)
      if (response.data && response.data.notes) {
        showToastMessage('Note Updated Successfully')
        getAllNotes()
      }
    } catch (error) {
        console.log(error)
    }
  }

  const onSearchNote = async (query)=>{
    try {
      const response = await axiosInstance.get('/search-notes',{
        params:{query}
      })
      console.log(response)
      if (response.data && response.data.notes) {
        console.log(response)
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleClearSearch = ()=>{
    setIsSearch(false)
    getAllNotes()
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {
    }
  }, [])

  
  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className='container mx-auto max-w-full'>
        { allNotes.length > 0 ? (
          <div className='grid grid-cols-4  gap-18 mx-25 my-10'>
          {allNotes.map((item, index) => (
                <NoteCard
                  key={item.id} 
                  title={item.title}
                  date={moment(item.createdon).format('Do MMM YYYY')} 
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.ispinned}
                  onEdit={()=>handleEdit(item)}  
                  onDelete={()=>deleteNote(item)}
                  onPinNote={()=>updateIsPinned(item)}    
                />
              ))}
          {/*<div className='container mx-auto w-100'></div>*/}         
       </div> ) : (
        <EmptyCard imgSrc={isSearch ? NoData: AddNoteImg} message={
          isSearch 
            ? `Oops! No notes found matching your seatch` 
            : `Starting creating your first note! Click 'Add' button to jot down your thougths, ideas and reminders. Let's get started!`
          }
        />
        )
       }
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
          showToastMessage={showToastMessage}
        />
        </Modal>

       <Toast 
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onCLose={handleCloseToast}
       />
       
    </>
  )
}

export default Home
