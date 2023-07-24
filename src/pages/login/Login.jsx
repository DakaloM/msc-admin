import React, { useContext, useState } from 'react';
import "./login.scss";
import PageHeader from '../../components/pageHeader/PageHeader';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../redux/features/apiCalls';
import Loading from '../../components/loading/Loading';

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const url = useLocation().search
  const user = useSelector(state => state.user)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      login(dispatch, {username, password}, navigate)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(true)
      const message = error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error"
      if(message === 'Invalid Token') {
          setErrorMessage("Your session has expired. Please sign in again")
      }
      else {

          setErrorMessage(message)
      }
    }
    
  }

 

  return (
    <div className='login overFlow'>
        {
          url.includes("success=true") && 
          <div className="message">
            <span className="messageText">
              Registration successful pending admin approval

              <span>Once approved you will be able to access the admin area</span>
            </span>
          </div>
        }
        {
          url.includes("admin=false") && 
          <div className="message error">
            <span className="messageText">
              Error! You are not authorizes to access the admin area
            </span>
          </div>
        }
        <div className="wrapper">
            <PageHeader title="Login" desc={"Fill the form below to access Admin panel"}/>

            <form action="">

                <div className="inputGroup">
                  <label htmlFor="username">Username:</label>
                  <input type="text" id='username' name='username'  onChange={(e) => setUsername(e.target.value)}/>
                </div>

                <div className="inputGroup">
                  <label htmlFor="password">Password:</label>
                  <input type="password" id='password' name='password'  onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <span className="redirect">Dont have an account? Sign up<Link className='link' to="/register">here</Link></span>
                {user.error && <span className="errorText">{user.errorMessage}</span>}
                <button type='submit' onClick={handleLogin}>
                    {
                      user.isfetching ? <Loading color={"white"} size={20}/> : "Login"
                    }
                </button>
            </form>
        </div>
    </div>
  )
}

export default Login