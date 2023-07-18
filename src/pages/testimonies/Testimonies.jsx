import React, { useEffect, useState } from 'react';
import "./testimonies.scss";
import DataTable from "../../components/table/Table"
import Rating from '../../components/rating/Rating';
import FileUpload from '../../components/fileUpload/FileUpload';
import Search from '../../components/search/Search';
import { useStateContext } from '../../context/ContextProvider';
import PageHeader from '../../components/pageHeader/PageHeader';
import Image from '../../components/image/Image';
import Loading from '../../components/loading/Loading';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { userRequest } from '../../requestMethod';
import Notification from '../../components/notification/Notification';
import { notify } from '../../utils/methods';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Testimonies = () => {
  const [number, setNumber ] = useState(0);
  const [file, setFile ] = useState();
  const [search, setSearch] = useState("")
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [event, setEvent] = useState(0);
  const [testimonies, setTestimonies] = useState()
  const [name, setName] = useState("")
  const [extra, setExtra] = useState("")
  const [message, setMessage] = useState("");
  const [fileMissing, setFileMissing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [complete, setComplete] = useState(false)
  const [completeMessage, setCompleteMessage] = useState(false)
  const [completeType, setCompleteType] = useState("")
  const [ratingMissing, setRatingMissing] = useState(false)
  const [inputsMissing, setInputsMissing] = useState(false)
  

  useEffect(() =>{
    if(complete === true){
      notify(completeType, completeMessage)

      
    }
  },[complete])



  useEffect(() => {
    const fetchTest = async() => {
      setLoading(true)
      try {
        const res = await userRequest.get('testimonies')
        setTestimonies(res.data)
        console.log(res.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchTest();
  },[event])
  
  const handleCreateTest = (e) => {

    e.preventDefault();
    
    if (complete === true) {
      setComplete(false)
    }
    if(name === "" || extra === "" || message === ""){
      setInputsMissing(true)
      return
    }
    
    if(number === 0){
        setRatingMissing(true)
        return
    }
    if(!file){
      setFileMissing(true)
      setSubmitLoading(false)
      return
    } else {

      const filename = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, filename)
      const uploadTask = uploadBytesResumable(storageRef, file);
      ratingMissing && setRatingMissing(false)
      fileMissing && setFileMissing(false)
      inputsMissing && setInputsMissing(false)
      setSubmitLoading(true)
  
      
  
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
                  const res = await userRequest.post(`testimonies`, {name,extra,desc: message, rating: number , image: downloadURL})  
                 
                  setComplete(true)
                  setCompleteType("success")
                  setCompleteMessage(res.data.message)
                  setEvent(prev => prev + 1)
                  setSubmitLoading(false)
                  setName("");
                  setMessage("");
                  setFile()
                } catch (error) {
                    setSubmitLoading(false)
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


  const deleteTest = async (id) => {
    complete === true && setComplete(false);
    try {
      const res = await userRequest.delete(`testimonies/${id}`);
      setComplete(true);
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 1)
    } catch (error) {
      setComplete(true);
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
    <div className='testimonies overFlow' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
      <ToastContainer />
      <PageHeader title="Testimonies" desc="Testimonies" />
      
      
      <div className="newTest">
        <span></span>
        <h2 className="title">Add Testimony</h2>
        {
          file && <Image width={200} height={200} file={file}/>
        }
        <form action="">
          <div className="inputs">
            <div className="inputGroup">
              <input type="text" required placeholder='Name...' onChange={(e) => setName(e.target.value)} value={name}/>
              {inputsMissing && <span className="errorText small">This field is required</span>}
            </div>
            <div className="inputGroup">
              <textarea type="text" required placeholder='Message...' onChange={(e) => setMessage(e.target.value)} value={message}/> 
              {inputsMissing && <span className="errorText small">This field is required</span>} 
            </div>
            <div className="inputGroup">
              <input type="text" required placeholder='Company, or what they represent' onChange={(e) => setExtra(e.target.value)} value={extra}/>
              {inputsMissing && <span className="errorText small">This field is required</span>}
            </div>
            

          </div>
          
          <Rating number={number} setNumber={setNumber} label={true} click={true}/>
          {ratingMissing && <span className='errorText'>Rating is required</span>}


          <div className="col">
          <FileUpload setFile={setFile} iconColor="orange"/>
          { fileMissing && <span className="errorText">File Missing</span>}

          </div>

          <button onClick={handleCreateTest}>
            {submitLoading ? <Loading size={20}/> : "Save"}
          </button>
        </form>
      </div>

      <Search setSearch={setSearch}/>

      <div className="testList">
        {
          loading ? <Loading />
          :
          testimonies ?
            <DataTable variant="testimony" data={testimonies} deleteAction={deleteTest}/>
            : "No record found"
        }
      </div>
    </div>
  )
}

export default Testimonies