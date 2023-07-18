import React, { useEffect, useState } from 'react';
import "./categories.scss";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Actions from "../../components/actions/Actions"
import { useStateContext } from '../../context/ContextProvider';
import PageHeader from '../../components/pageHeader/PageHeader';
import { publicRequest, userRequest } from '../../requestMethod';
import Loading from '../../components/loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/methods'; 

const Categories = () => {
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext();
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [errMessage, setErrMessage] = useState("")
  const [event, setEvent] = useState(0)
  const [complete, setComplete] = useState(false)
  const [completeMessage, setCompleteMessage] = useState(false)
  const [completeType, setCompleteType] = useState("")


  useEffect(() =>{
    if(complete === true){
      notify(completeType, completeMessage)

      
    }
  } ,[complete])

  

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await publicRequest.get("categories");
        setCategories(res.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    fetchCategories();
  }, [event])


  const handleCatAdd = async (e) => {
    e.preventDefault();
    setButtonLoading(true)
    complete && setComplete(false)
    try {
      const res = await userRequest.post("categories", {title: category})
      setComplete(true)
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 1)
      setButtonLoading(false)
    } catch (error) {
      console.log(error)
      setButtonLoading(false)
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

  const hadleCatDelete = async(id) => {
    complete && setComplete(false)
    try {
      const res = await userRequest.delete(`categories/${id}`)
      setComplete(true)
      setCompleteType("success")
      setCompleteMessage(res.data.message)
      setEvent(prev => prev + 1)
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
    <div className='categories' style={{paddingLeft: activeMenu ? "0" : "20px"}}>
      <ToastContainer />
      <PageHeader title="Categories" desc="Categories" />



      
          <div className="newCat">
            <h2 className='title'>Add Category</h2>
            <div className="wrapper">

            <form action="">
              <input type="text" placeholder='Category Name...' onChange={(e) => setCategory(e.target.value)}/>
              <button>
                {
                  buttonLoading ? <Loading size={20}/> : <AddOutlinedIcon className='icon' onClick={handleCatAdd}/>
                }
                
              </button>
            </form>
           { errMessage !== "" && <span className="error">{errMessage}</span>}
            </div>
          </div>


          {
            loading ?  <Loading />
            : 

            <div className="catList">
              <ul>
                {
                  categories && categories.length > 0  && categories.map((cat) => (
                      <li className="catItem" key={cat._id}>
                        <span>{cat.title}</span>
                        <Actions  remove="remove" deleteAction={() => hadleCatDelete(cat._id)}/>
                    </li>
                  ))
                }
                
                
              </ul>
              
            </div>
          }


    </div>
  )
}

export default Categories