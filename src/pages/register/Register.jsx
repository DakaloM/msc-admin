import React, { useState } from 'react';
import "./register.scss";
import PageHeader from '../../components/pageHeader/PageHeader';
import { Link, useNavigate } from 'react-router-dom';
import FileUpload from '../../components/fileUpload/FileUpload';
import Image from '../../components/image/Image';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { publicRequest } from '../../requestMethod';
import Loading from '../../components/loading/Loading';

const Register = () => {

  const [file, setFile] = useState()
  const [inputs , setInputs] = useState()
  const [password, setPassword] = useState();
  const [confPassword, setConfPassword] = useState();
  const [passWordsMatch, setPassWordsMatch] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState("")

  const navigate = useNavigate();

  const handleInputs = (e) => {
    setInputs(prev => ({...prev, [e.target.name]:e.target.value}))
  }


  const handleRegister = async (e) => {
      e.preventDefault()
      setLoading(true)
      error !== "" && setError("");
      try {
        const res = await publicRequest.post('auth/register', {...inputs, password})
        setLoading(false)
        navigate("/login?success=true")
      } catch (error) {
        setLoading(false)
        console.log(error)
        setError(error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error")
      }
  }


  return (
    <div className='register overFlow'>
        <div className="wrapper">
            <PageHeader title="Register" desc={"Register! Take one step to becoming an Admin"}/>

              {
                file && <Image file={file} width={200} height={200} />
              }

            <form action="">

                <div className="inputGroup">
                  <label htmlFor="username">Username:</label>
                  <input type="text" id='username' name='username' required onChange={handleInputs}/>
                </div>
                

                <div className="inputGroup">
                  <label htmlFor="firstname">First name:</label>
                  <input type="text" id='firstname' name='firstname' required  onChange={handleInputs}/>
                </div>
                <div className="inputGroup">
                  <label htmlFor="lastname">Last name:</label>
                  <input type="text" id='lastname' name='lastname'  required onChange={handleInputs}/>
                </div>


                <div className="inputGroup">
                  <label htmlFor="password">Password:</label>
                  <input type="password" id='password' name='password' required onChange={(e) => setPassword(e.target.value)} />
                  {passWordsMatch == false && <span className="error">Passwords do not match</span>}
                </div>

                <div className="inputGroup">
                  <label htmlFor="confPassword">Confirm password:</label>
                  <input type="password" id='confPassword' name='confPassword' required onChange={(e) => setConfPassword(e.target.value)}/>
                  {passWordsMatch == false && <span className="error">Passwords do not match</span>}
                </div>

                <div className="group">
                    <span className="redirect">Already have an account? Sign in<Link className='link' to="/login">here</Link></span>
                    { error !== ""  && <span className="error">Error!....{error}</span>}
                    <button type='submit' onClick={handleRegister}>
                      {loading ? <Loading color={"white"} size={20} /> : "Register"}
                    </button>
                </div>

                
            </form>
        </div>
    </div>
  )
}

export default Register