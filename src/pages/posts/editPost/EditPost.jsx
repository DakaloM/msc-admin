import React, { useEffect, useState } from 'react';
import "./editPost.scss";

import FileUpload from '../../../components/fileUpload/FileUpload';
import Loading from '../../../components/loading/Loading';
import Categories from '../../../components/categories/Categories';
import Image from '../../../components/image/Image';
import { userRequest } from '../../../requestMethod';
import { useLocation, useParams } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../../firebase';
import { notify } from '../../../utils/methods';
import { NavigationTimingPolyfillEntry } from 'web-vitals'; 
import { ToastContainer, toast } from 'react-toastify';
import PageHeader from '../../../components/pageHeader/PageHeader';

const EditPost = () => {
    const [category, setCategory] = useState("")
    const [title, setTitle] = useState("")
    const [story, setStory] = useState("")
    const [file, setFile] = useState()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [post, setPost] = useState([])
    const [uploadProgress, setUploadProgress] = useState(0)
    const [event, setEvent] = useState(0);
    const [complete, setComplete] = useState(false)
    const [completeMessage, setCompleteMessage] = useState(false)
    const [completeType, setCompleteType] = useState("");

    useEffect(() =>{
        if(complete === true){
          notify(completeType, completeMessage)
    
          
        }
    },[complete])


    const postId = useParams().id

    useEffect( () => {
        const fetchPost = async () => {
            setLoading(true)
            try {
                const res = await userRequest.get(`posts/${postId}`)
                setLoading(false)
                setPost(res.data)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }

        fetchPost();
    }, [event])

    const handleUpdatePostWithFile = () => {

        complete && setComplete(false)
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
                    
                    const newPost = {
                        title: title === ""? post.title : title,
                        category: category === ""? post.category : category,
                        story: story === ""? post.story : story,
                    }
                  try {
                    const res = await userRequest.patch(`posts/${postId}`, {...newPost, image: downloadURL})  
                    setComplete(true)
                    setCompleteType("success")
                    setCompleteMessage(res.data.message)
                    setEvent(prev => prev + 1)
                    setSubmitLoading(false)
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
    const handleUpdatePostWithoutFile = async () => {
        setLoading(true)
        complete && setComplete(false)
        const newPost = {
            title: title === ""? post.title : title,
            category: category === ""? post.category : category,
            story: story === ""? post.story : story,
        }
        try {
            const res = await userRequest.patch(`posts/${postId}`, newPost);
            setLoading(false)
            setComplete(true)
            setCompleteType("success")
            setCompleteMessage(res.data.message)
            setEvent(prev => prev + 1)
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


    const hadleUpdatePost = async(e) => {
        e.preventDefault();
        if(file) {
            handleUpdatePostWithFile();
        }else {
            handleUpdatePostWithoutFile();
        }
    }
  return (
    <div className='editPost overFlow'>
        <PageHeader title="Posts" desc={"Edit post"}/>
        <ToastContainer />

        <div className="form">

            <h2>Edit Post</h2>
            <span className='specialtext'><KeyboardArrowRightIcon className='icon'/>PostID: <span className='text'>{postId}</span></span>
            
            {
            file ? <Image file={file} width={200} height={200}/> : <Image image={post.image} width={200} height={200} />
            }

            <form action="">
            <div className="inputGroup">
                <label htmlFor="title">Title:</label>
                <input type="text" id='title' name='title' defaultValue={post.title} required placeholder={post.title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="inputGroup">
                <label htmlFor="category">Category:</label>
                <Categories setCategory={setCategory} selected={<option selected value={post.category}>{post.category}</option>}/>
            </div>
            <div className="inputGroup">
                <label htmlFor="story">Story:</label>
                <textarea name="desc" id="story" cols="30" rows="10" required defaultValue={post.story} onChange={(e) => setStory(e.target.value)}></textarea>
            </div>
            
            <FileUpload iconColor="orange" setFile={setFile}/>

            
            <button type='button' disabled={loading} onClick={hadleUpdatePost}>
                {submitLoading ? <Loading size={20}/> : "Update post"}
            </button>
            </form>
        </div>
    </div>
  )
}

export default EditPost