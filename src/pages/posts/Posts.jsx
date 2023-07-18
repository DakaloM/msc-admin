import React, { useState, useEffect } from 'react';
import "./posts.scss";
import DataTable from '../../components/table/Table';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useStateContext } from '../../context/ContextProvider';
import FileUpload from '../../components/fileUpload/FileUpload';
import Search from "../../components/search/Search";
import PageHeader from '../../components/pageHeader/PageHeader';
import Image from '../../components/image/Image';
import Categories from '../../components/categories/Categories';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { publicRequest, userRequest } from '../../requestMethod';
import { useSelector } from 'react-redux';
import Loading from '../../components/loading/Loading';
import ViewPost from '../../components/viewPost/ViewPost';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/methods';
import { NavigationTimingPolyfillEntry } from 'web-vitals'; 
import { ToastContainer, toast } from 'react-toastify';

const Posts = () => {
  const [file, setFile] = useState()
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [categoryMissing, setCategoryMissing] = useState(false)
  const [titleMissing, setTitleMissing] = useState(false)
  const [storyMissing, setStoryMissing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState("")
  const [event, setEvent] = useState(0)
  const [openPost, setOpenPost] = useState(false)
  const [post, setPost] = useState(false)
  const [fileMissing, setFileMissing] = useState(false)
  const [complete, setComplete] = useState(false)
  const [completeMessage, setCompleteMessage] = useState(false)
  const [completeType, setCompleteType] = useState("")

  useEffect(() =>{
    if(complete === true){
      notify(completeType, completeMessage)

      
    }
},[complete])
  

  useEffect(() => {

    const fetchPosts = async () => {
      setLoading(true)
      try {
        const res = await userRequest.get(`posts?new=true`)
        setPosts(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
        
      }
    }

    fetchPosts();
  
  }, [event])
  
  const viewPost =  () => {
      setOpenPost(true)
  }

  const user = useSelector(state => state.user.currentUser)

  const handleCreatePost = () => {
    setSubmitLoading(true)
    complete && setComplete(false)
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
                const res = await userRequest.post(`posts`, {title, category,story, image: downloadURL, userId : user._id})  
                setComplete(true)
                setCompleteType("success")
                setCompleteMessage(res.data.message)
                setEvent(prev => prev + 1)
                setSubmitLoading(false)
                setTitle("");
                setStory("");
                setCategory("")
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

  const createPost = (e) => {
    e.preventDefault();
    if(!file){
      setFileMissing(true)
    }
    if(title === ""){
      setTitleMissing(true)
      return
    }
    if(category === ""){
      setCategoryMissing(true)
      return
    }
    if(story === ""){
      setStoryMissing(true)
      return
    }
    else {
      fileMissing && setFileMissing(false)
      titleMissing && setTitleMissing(false)
      categoryMissing && setCategoryMissing(false)
      storyMissing && setStoryMissing(false)
      handleCreatePost();
    }
  }




const deletePost = async (id) => {
  complete && setComplete(false)
  setLoading(true)
    try {
      const res = await userRequest.delete(`posts/${id}`);
      setLoading(false)
      setComplete(true)
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 10)
    } catch (error) {
      setLoading(false)
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
}

const pinStory = async (id) => {
  console.log(id)
  try {
    const res = await userRequest.patch(`posts/${id}`, {pinned: true});
    setLoading(false)
    setComplete(true)
    setCompleteType("success")
    setCompleteMessage(res.data.message)
    setEvent(prev => prev + 5)
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
}

const unPinStory = async (id) => {
  
  try {
    const res = await userRequest.patch(`posts/${id}`, {pinned: false});
    setLoading(false)
    setComplete(true)
    setCompleteType("success")
    setCompleteMessage(res.data.message)
    setEvent(prev => prev + 5)
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
}


  return (
    <div className='posts overFlow' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
      <ToastContainer />
      <PageHeader title="Posts" desc="Posts"/>
      <Search setSearch={setSearch}/>

      {
        openPost && <ViewPost post={post} setOpenPost={() => setOpenPost(false)}/>
      }

      <div className="postList" >
        <DataTable variant="post" data={posts} viewAction={() => setOpenPost(true)} setValue={setPost} editAction={`/editPost`}
            deleteAction={ deletePost } pinAction={pinStory} unPinAction={unPinStory}
        
        />
      </div>

      <div className="form" id='addPost'>
        <h2>Add New Post</h2>
        
          {
            file && <Image file={file} width={200} height={200}/>
          }
       
       
        <form action="">
          <div className="inputGroup">
            <label htmlFor="title">Title:</label>
            <input type="text" id='title' name='title' required placeholder='Title' onChange={(e) => setTitle(e.target.value)}/>
            {titleMissing && <span className="errorText small">this field is required</span>}
          </div>
          <div className="inputGroup">
            <label htmlFor="category">Category:</label>
            <Categories setCategory={setCategory}/>
            {categoryMissing && <span className="errorText small">this field is required</span>}
          </div>
          <div className="inputGroup">
            <label htmlFor="story">Story:</label>
            <textarea name="desc" id="story" cols="30" rows="10" required placeholder='Your Story' onChange={(e) => setStory(e.target.value)}></textarea>
            {storyMissing && <span className="errorText small">this field is required</span>}
          </div>
          

          
          
           
          <FileUpload iconColor="orange" setFile={setFile}/>
     
           
          {fileMissing && 
            <span className='errorText'>File is missing</span>
          }
          
          <button type='submit' disabled={loading} onClick={createPost}>
             {submitLoading ? <Loading size={20}/> : "Create post"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Posts