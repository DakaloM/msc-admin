import React, { useEffect, useState } from 'react';
import "./slides.scss";
import { useStateContext } from '../../context/ContextProvider';
import DataTable from '../../components/table/Table';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import Search from '../../components/search/Search';
import PageHeader from '../../components/pageHeader/PageHeader';
import FileUpload from '../../components/fileUpload/FileUpload';
import Image from '../../components/image/Image';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useSelector } from 'react-redux';
import { userRequest } from '../../requestMethod';
import Loading from '../../components/loading/Loading';
import ViewPost from '../../components/viewPost/ViewPost';

const Slides = () => {
  const [file, setFile] = useState()
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const [search, setSearch] = useState("")
  const [inputs, setInputs] = useState();
  const [fileMissing, setFileMissing] = useState(false)
  const [error, setError] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [event, setEvent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [slides, setSlides] = useState([])
  const [openSlide, setOpenSlide] = useState(false)
  const [slide, setSlide] = useState()

  const handleInputs = (e) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const user = useSelector(state => state.user.currentUser)

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true)
      try {
        const res = await userRequest.get("slides")
        setLoading(false)
        setSlides(res.data)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    fetchSlides()
  }, [event])

  const deleteSlide = async (id) => {
    setLoading(true)
    try {
      const res = await userRequest.delete(`slides/${id}`);
      setEvent(prev => prev + 10)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  

  const handleCreateSlide = (e) => {
    e.preventDefault()

    if(!file) {
      setFileMissing(true)
    } else {
      setFileMissing(false)
      setSubmitLoading(true)
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
                  const res = await userRequest.post(`slides`, {...inputs, image: downloadURL, userId: user._id})  
                  setError(false)
                  console.log(res.data)
                  setEvent(prev => prev + 1)
                  setSubmitLoading(false)
                  setFile()
                } catch (error) {
                    console.log(error)
                    setSubmitLoading(false)
                    setError(
                      error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error")
                }
            });
        }
        );
      
    }

  


}


  return (
    <div className='slides overFlow' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
      <PageHeader title="Slides" desc="Slides" />
      <span className="unavailable">Here you'll be able to manage the slides on your home page. COMING SOON</span>
      {/* {
        openSlide && <ViewPost slide={slide} setOpenSlide={() => setOpenSlide(false)}/>
      }

      <Search setSearch={setSearch}/>
      <div className="postList" >
        <DataTable variant={"slide"} data={slides} viewAction={() => setOpenSlide(true)} setValue={setSlide}
          editAction={`/editSlide`} deleteAction={deleteSlide}
        />
      </div>

      <div className="form" id='addPost'>
        <h2>Add New Slide</h2>

        {
          file && <Image width={200} height={200} file={file}/>
        }
        <form action="">
          <div className="inputGroup">
            <label htmlFor="title">Title:</label>
            <input type="text" id='title' name='title' required placeholder='Title' onChange={handleInputs}/>
          </div>
          <div className="inputGroup">
            <label htmlFor="url">URL:</label>
            <input type="text" id='url' name='url' required placeholder='/home'  onChange={handleInputs}/>
          </div>
          <div className="inputGroup">
            <label htmlFor="story">Description:</label>
            <textarea name="desc" id="story" cols="30" rows="10" required placeholder='Your Story' onChange={handleInputs}></textarea>
          </div>
          
          <FileUpload iconColor={"orange"} setFile={setFile}/>
          {fileMissing && <span className="error">File missing</span>}

          {error && <span className="error">{error}</span>}

          <button type='button' disabled={submitLoading} onClick={handleCreateSlide}>
          {submitLoading ? <Loading size={20}/> : "Create slide"}
          </button>
        </form>
      </div> */}
    </div>
  )
}

export default Slides