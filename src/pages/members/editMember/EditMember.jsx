import React, { useEffect, useState } from 'react';
import "./editMember.scss";
import PageHeader from '../../../components/pageHeader/PageHeader';
import Image from '../../../components/image/Image';
import FileUpload from '../../../components/fileUpload/FileUpload';
import Loading from '../../../components/loading/Loading';
import { useParams } from 'react-router-dom';
import { userRequest } from '../../../requestMethod';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../../utils/methods';
import { NavigationTimingPolyfillEntry } from 'web-vitals'; 

const EditMember = () => {
    const [file, setFile] = useState()
    const [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
        role: "",
        about: "",
      });
      
    const [uploadloading, setUploadLoading] = useState(false)
    const [error, setError] = useState("")
    const [uploadProgress, setUploadProgress] = useState(0)
    const [event, setEvent] = useState(false)
    const [employee, setEmployee] = useState()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [complete, setComplete] = useState(false)
    const [completeMessage, setCompleteMessage] = useState(false)
    const [completeType, setCompleteType] = useState("")
  
    const [successMessage, setSuccessMessage] = useState("")

    const employeeId = useParams().id


    const handleInputs = (e) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    useEffect(() => {
      const fetchEmployee = async() =>{
            setLoading(true)
            try {
                const res = await userRequest.get(`employees/${employeeId}`)
                setEmployee(res.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
      }

      fetchEmployee()
    
      
    }, [event])

    


    const updateEmployeeWithFile = () => {

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
                    
                    const newEmployee = {
                        firstname: inputs.firstname === "" ? employee.firstname : inputs.firstname,
                        lastname: inputs.lastname === "" ? employee.lastname : inputs.lastname,
                        role: inputs.role === "" ? employee.role : inputs.role,
                    }
                    try {
                        const res = await userRequest.patch(`employees/${employeeId}`, {...newEmployee, image: downloadURL})  
                        
                        
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
                        })
                    } catch (error) {
                        console.log(error)
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

    
    const updateEmployeeWithoutFile = async () => {
        setUploadLoading(true)

        const newEmployee = {
            firstname: inputs.firstname === "" ? employee.firstname : inputs.firstname,
            lastname: inputs.lastname === "" ? employee.lastname : inputs.lastname,
            role: inputs.role === "" ? employee.role : inputs.role,
            about: inputs.about === "" ? employee.about : inputs.about,
        }
        try {
            const res = await userRequest.patch(`employees/${employeeId}`, {...newEmployee})  
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
                about: ""
            })
          } catch (error) {
                console.log(error)
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
    }
    const updateEmployee = (e) => {
        e.preventDefault();
        if(!file) {
            updateEmployeeWithoutFile();
        } else {
            updateEmployeeWithFile();
        }
    }

    useEffect(() =>{
        if(complete === true){
          notify(completeType, completeMessage)
    
          
        }
    },[complete])


       
  return (

    
    <div className='editMember overFlow'>
        <PageHeader title="Employees" desc={`Edit employee with Id: ${employeeId}`} />
        <ToastContainer />
        {  loading === false?

            employee &&
            <div className="form">
                <h2 className="title">Edit Employee</h2>

                {
                file ?<Image file={file} width={200} height={200}/> :  <Image image={employee.image} width={200} height={200}/>
                }

                <form action="">
                <div className="inputGroup">
                    <label htmlFor="firstname">First name:</label>
                    <input type="text" id='firstname' required={true} name='firstname' placeholder={employee.firstname} value={inputs.firstname} onChange={handleInputs}/>
                    
                </div>

                <div className="inputGroup">
                    <label htmlFor="lastname">Last name:</label>
                    <input type="text" id='lastname' required name='lastname' value={inputs.lastname} placeholder={employee.lastname} onChange={handleInputs}/>
                    
                </div>
                <div className="inputGroup">
                    <label htmlFor="role">Role:</label>
                    <input type="text" id='role' name='role'required value={inputs.role} placeholder={employee.role} onChange={handleInputs}/>
                    
                </div>

                <div className="inputGroup">
                    <label htmlFor="about">About:</label>
                    <textarea type="text" id='about' name='about'required defaultValue={employee.about} value={inputs.about} placeholder={employee.about} onChange={handleInputs}/>
                    
                </div>

                <FileUpload setFile={setFile} iconColor={"orange"}/>


                <button type='submit' disabled={uploadloading} onClick={updateEmployee}>
                    {
                    uploadloading? <Loading size={20}/> : "Save"
                    }
                </button>
                </form>
            </div>

            :
            <Loading />
        }
    </div>
 
  )
}

export default EditMember