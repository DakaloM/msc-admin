import React, { useEffect, useState } from 'react';
import "./editSlide.scss";
import Image from '../../../components/image/Image';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../../firebase';
import { useStateContext } from '../../../context/ContextProvider';
import Loading from '../../../components/loading/Loading';
import FileUpload from '../../../components/fileUpload/FileUpload';
import PageHeader from '../../../components/pageHeader/PageHeader';
import { useParams } from 'react-router-dom';
import { publicRequest, userRequest } from '../../../requestMethod';

const EditSlide = () => {

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

    const slideId = useParams().id

    useEffect(() => {
        const fetchSlide = async() =>{
            setLoading(true)
            try {
                const res = await userRequest.get(`slides/${slideId}`);
                setSlide(res.data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }

        fetchSlide()
    }, [event])

    console.log(inputs)

    const handleInputs = (e) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const updateWithFile = async () => {
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
                    const res = await userRequest.patch(`slides/${slideId}`, {...inputs, image: downloadURL})  
                    setError(false)
                    console.log(res.data)
                    setEvent(prev => prev + 1)
                    setSubmitLoading(false)
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
    const updateWithoutFile = async () => {
        setSubmitLoading(true)
        try {
            const res = await userRequest.patch(`slides/${slideId}`, {...inputs})
            console.log(res.data)
            setSubmitLoading(false)
            setEvent(prev => prev + 1)
        } catch (error) {
            setSubmitLoading(false)
            setError(
                error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error"
            )
        }
    }

    const handleUpdateSlide = (e) => {
        e.preventDefault()
        if(!file) {
            updateWithoutFile();
        } else {
            updateWithFile();
        }
    }

    return (

        loading? <Loading />
        :
        slide && 
        <div className='editSlide overFlow' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
            <PageHeader title="Slides" desc={`Edit Slide with Id: ${slideId}`} />
            <div className="form" id='addPost'>
                <h2>Edit Slide</h2>

                {
                file ? <Image width={200} height={200} file={file}/> : slide && <Image width={200} height={200} image={slide.image}/>
                }
                <form action="">
                <div className="inputGroup">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id='title' name='title' required placeholder={slide.title} onChange={handleInputs}/>
                </div>
                <div className="inputGroup">
                    <label htmlFor="url">URL:</label>
                    <input type="text" id='url' name='url' required placeholder={slide.url}  onChange={handleInputs}/>
                </div>
                <div className="inputGroup">
                    <label htmlFor="story">Description:</label>
                    <textarea name="desc" id="story" cols="30" rows="10" required placeholder={slide.desc} onChange={handleInputs}></textarea>
                </div>
                
                <FileUpload iconColor={"orange"} setFile={setFile}/>
                {fileMissing && <span className="error">File missing</span>}

                {error && <span className="error">{error}</span>}

                <button type='button' disabled={submitLoading} onClick={handleUpdateSlide}>
                {submitLoading ? <Loading size={20}/> : "Save"}
                </button>
                </form>
            </div>
        </div>
  )
}

export default EditSlide