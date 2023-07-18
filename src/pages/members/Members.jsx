import React, { useEffect, useState } from 'react';
import "./members.scss";
import Search from '../../components/search/Search';
import DataTable from '../../components/table/Table';
import { useStateContext } from '../../context/ContextProvider';
import FileUpload from '../../components/fileUpload/FileUpload';
import PageHeader from '../../components/pageHeader/PageHeader';
import Image from '../../components/image/Image';
import Loading from '../../components/loading/Loading';
import userEvent from '@testing-library/user-event';
import { userRequest } from '../../requestMethod';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/methods';

const Members = () => {
  const [file, setFile] = useState()
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const [search, setSearch] = useState("")
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    role: "",
    about: "",
  });
  const [loading, setLoading] = useState(false)
  const [uploadloading, setUploadLoading] = useState(false)
  const [fileMissing, setFileMissing] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [event, setEvent] = useState(false)
  const [firstnameMissing, setFirstnameMissing] = useState(false)
  const [lastnameMissing, setLastnameMissing] = useState(false)
  const [roleMissing, setRoleMissing] = useState(false)
  const [aboutMissing, setAboutMissing] = useState(false)
  const [employees, setEmployees] = useState([])
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [complete, setComplete] = useState(false)
  const [completeMessage, setCompleteMessage] = useState(false)
  const [completeType, setCompleteType] = useState("")
  

  const handleInputs = (e) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  //Get all employees
  useEffect(() => {
    const fetchEmployees = async() => {
      setLoading(true)
      try {
        const res = await userRequest.get("employees");
        setEmployees(res.data); 
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchEmployees();
  }, [event])

  useEffect(() =>{
    if(complete === true){
      notify(completeType, completeMessage)

      
    }
  },[complete])

  const createEmployee = (e) => {
    e.preventDefault();
    if(!file) {
      setFileMissing(true)
      return
    }
    if(inputs.firstname === ""){
      setFirstnameMissing(true)
      return
    }
    if(inputs.lastname === ""){
      setLastnameMissing(true)
      return
    }
    if(inputs.role === ""){
      setRoleMissing(true)
      return
    }
    if(inputs.about === ""){
      setAboutMissing(true)
      return
    }
    else{
        
        complete && setComplete(false);
        setFileMissing(false);
        setFirstnameMissing(false);
        setLastnameMissing(false);
        setAboutMissing(false);
        setRoleMissing(false);
        setUploadLoading(true)
        const filename = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename)
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        
    
        uploadTask.on('state_changed', 
          (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              setUploadProgress(progress)
              switch (snapshot.state) {
              case 'paused':
                  console.log('Upload is paused');
                  break;
              case 'running':
                  console.log('Upload is running');
                  break;
              }
          }, 
          (error) => {
              // Handle unsuccessful uploads
          }, 
          () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              // console.log('File available at', downloadURL);
        
                  
                  try {
                    const res = await userRequest.post(`employees`, {...inputs, image: downloadURL})  
                    setComplete(true)
                    setCompleteType("success")
                    setCompleteMessage(res.data.message)
                    setEvent(prev => prev + 1)
                    setUploadLoading(false)
                    setFile()
                    setInputs({
                      firstname: "",
                      lastname: "",
                      role: "",
                      about: "",
                    });
                  } catch (error) {
                      setUploadLoading(false)
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
              });
          }
          );
      
    }

  


  }



  const deleteEmployee = async (id) => {
    complete && setComplete(false);
    try {
      const res = await userRequest.delete(`employees/${id}`)
      setComplete(true)
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 2)
    } catch (error) {
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

  return (
    <div className='members overFlow' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
      <ToastContainer />

      <PageHeader title="Employees" desc="Employees" />
      <div className="newMem">
        <h2 className="title">Add New Staff Member</h2>

        {
          file && <Image file={file} width={200} height={200}/>
        }

        <form action="">
          <div className="inputGroup">
            <label htmlFor="firstname">First name:</label>
            <input type="text" id='firstname' required={true} name='firstname' value={inputs.firstname} onChange={handleInputs}/>
            {firstnameMissing && <span className="errorText small">This field required</span>}
          </div>

          <div className="inputGroup">
            <label htmlFor="lastname">Last name:</label>
            <input type="text" id='lastname' required name='lastname' value={inputs.lastname} onChange={handleInputs}/>
            {lastnameMissing && <span className="errorText small">This field required</span>}
          </div>

          <div className="inputGroup">
            <label htmlFor="role">Role:</label>
            <input type="text" id='role' name='role'required value={inputs.role} onChange={handleInputs}/>
            {roleMissing && <span className="errorText small">This field required</span>}
          </div>

          <div className="inputGroup">
            <label htmlFor="about">About:</label>
            <textarea type="text" id='about' name='about'required value={inputs.about} onChange={handleInputs}/>
            {aboutMissing && <span className="errorText small">This field required</span>}
          </div>


          <FileUpload iconColor="orange" setFile={setFile}/>
          
         
          {
            fileMissing && !error && <span className="errorText">{"File missing"}</span>
          }

          

          <button type='submit' disabled={uploadloading}  onClick={createEmployee}>
            {
              uploadloading? <Loading size={20}/> : "Save"
            }
          </button>
        </form>
      </div>

      {
        loading ? <Loading />

        :
        employees && employees.length > 0 ?
        <>
          
          <Search setSearch={setSearch}/>
          <div className="postList" >
            <DataTable variant="employee" data={employees} editAction={`/editMember`} 
              deleteAction={deleteEmployee }
            />
          </div>
        </>
        :
        <span className="noData">No Employees Found</span>
      }

      {/* <div className="form" id='addPost'>
        <h2>Add New Post</h2>
        <form action="">
          <div className="inputGroup">
            <label htmlFor="title">Title:</label>
            <input type="text" id='title' name='title' placeholder='Title' />
          </div>
          <div className="inputGroup">
            <label htmlFor="story">Description:</label>
            <textarea name="desc" id="story" cols="30" rows="10" placeholder='Your Story'></textarea>
          </div>
          <div className="inputGroup file">
            <label htmlFor="file">Upload Image: <UploadFileOutlinedIcon className='icon' /></label>
            <input type="file" id='file' style={{display: "none"}}/>
          </div>

          <button type='button'>
              Create slide
          </button>
        </form>
      </div> */}
    </div>
  )
}

export default Members