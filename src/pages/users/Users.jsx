import React, { useEffect, useState } from 'react';
import "./users.scss";
import { useStateContext } from '../../context/ContextProvider';
import DataTable from '../../components/table/Table';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import Search from '../../components/search/Search';
import PageHeader from '../../components/pageHeader/PageHeader';
import FileUpload from '../../components/fileUpload/FileUpload';
import Image from '../../components/image/Image';
import { userRequest } from '../../requestMethod';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/methods';
import { ToastContainer } from 'react-toastify';
import Loading from '../../components/loading/Loading';

const Users = () => {
  const [file, setFile] = useState()
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const [search, setSearch] = useState("");
  const [event, setEvent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState();
  const [complete, setComplete] = useState(false)
  const [completeMessage, setCompleteMessage] = useState(false)
  const [completeType, setCompleteType] = useState("")

  // const user = useSelector(state => state.user.currentUser)

  useEffect(() =>{
    if(complete === true){
      notify(completeType, completeMessage)

      
    }
  },[complete])

  useEffect(() => {
    const fetchUsers = async() => {
        setLoading(true)
        try {
          const res = await userRequest.get('users')
          setLoading(false)
          setUsers(res.data)
        } catch (error) {
          setLoading(false)
          console.log(error)
        }
    }
    fetchUsers();
  }, [event])

  const updateUser = async(id,action) => {
    setLoading(true)
    complete && setComplete(false);
    try {
      const res = await  userRequest.patch(`users/${id}`, action)
      setLoading(false)
      setComplete(true)
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 20)
    } catch (error) {
      setLoading(false)
      setComplete(true)
      setCompleteType("error")
      const message = error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error"
      if(message === 'Invalid Token') {
        setCompleteMessage("Your session has expired. Please sign in again")
      }
      else {

        setCompleteMessage(message)
      }
    }
  }
  const deleteUser = async(id) => {
    setLoading(true)
    complete && setComplete(false);
    try {
      const res = await userRequest.delete(`users/${id}`)
      setLoading(false)
      setComplete(true)
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 20)
    } catch (error) {
      setLoading(false)
      setComplete(true)
      setCompleteType("error")
      const message = error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error"
      if(message === 'Invalid Token') {
        setCompleteMessage("Your session has expired. Please sign in again")
      }
      else {

        setCompleteMessage(message)
      }
    }
  }

  const promoteUser = (id) => {
    const action = {isAdmin: true}
    updateUser(id,action);
  }

  const demoteUser = (id) => {
    const action = {isAdmin: false}
    updateUser(id,action);
  }


  return (
    <div className='users overFlow' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
      <ToastContainer />
      <PageHeader title="Users" desc="Users" />
      <Search setSearch={setSearch}/>
      {
        loading ? <Loading />
        : users && users.length > 0 ?
        <div className="postList" >
          <DataTable variant="user" color="red" data={users} setValue={setUser} promoteAction={promoteUser} demoteAction={demoteUser}
            deleteAction={deleteUser}
          />
        </div>
        :

        <span className="noDataText">No Users found!</span>
      }

      
    </div>
  )
}

export default Users