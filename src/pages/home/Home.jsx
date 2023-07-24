import React, { useEffect, useRef, useState } from 'react';
import "./home.scss";
import { useStateContext } from '../../context/ContextProvider';
import PageHeader from '../../components/pageHeader/PageHeader';
import FeedIcon from '@mui/icons-material/Feed';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DataTable from '../../components/table/Table';
import Post from '../../components/post/Post';
import { HashLink as Link } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import User from '../../components/user/User';
import Role from '../../components/role/Role';
import Loader from '../../components/loader/Loader';
import { userRequest } from '../../requestMethod';
import Loading from '../../components/loading/Loading';
import CancelIcon from '@mui/icons-material/Cancel';
import { TroubleshootOutlined } from '@mui/icons-material';
const Home = () => {
  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState();
  const [posts, setPosts] = useState();
  const [employees, setEmployees] = useState();
  const [event, setEvent] = useState(0)
  const [mainWidth, setMainWidth] = useState(0)
  const [noticeOpen, setNoticeOpen] = useState(undefined)
  const ref = useRef()

  const url = useLocation();

  useEffect(() => {
    setNoticeOpen(url.search? url.search.includes("user") && true: false)
  }, [])
  
  useEffect(() => {
    const width = ref.current.offsetWidth;
    setMainWidth(width);
}, [screenSize, activeMenu])


  useEffect(() => {
      const fetchPosts = async() => {
        setLoading(true)
        try {
            const res = await userRequest.get("posts?new=true")
            setPosts(res.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
      }

      fetchPosts()
  }, [event])

  useEffect(() => {
      const fetchUsers = async() => {
        setLoading(true)
        try {
            const res = await userRequest.get("users")
            setUsers(res.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
      }

      fetchUsers()
  }, [event])


  useEffect(() => {
      const fetchEmployees = async() => {
        setLoading(true)
        try {
            const res = await userRequest.get("employees")
            setEmployees(res.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
      }

      fetchEmployees()
  }, [event])


  const dimension = screenSize >= 1536 && !activeMenu ? "Dashboard" : "padding" 
  
  
  
  return (
    <div ref={ref} className={`home overFlow ${dimension}`} style={{paddingLeft: dimension !== "padding" ? activeMenu ? "0" : 20 : screenSize < 768? 20 : 100}}>
      <PageHeader title="Dashboard" desc={"Home"}/>

      <div className= {url.search? url.search.includes("user") && noticeOpen? "notice active": "notice"  : "notice"}
      style={{width: (mainWidth - 30),
        
      }}>
        <span className="closeButton" onClick={() => setNoticeOpen(false)}>
          <CancelIcon className='icon'/>
        </span>
        <img src="/img/warning.png" alt="warning image" />
        <div className="content">
          <span className="title">For security reasons</span>
          <p className="text">Your login session will expire in 1 hour. After that you will not be able to perform admin actions.
            You must sign in again to regain admin access.
          </p>
          <p className="warning">If this is not your device, make sure to sign out when you are done!</p>
        </div>
      </div>
      
      <div className="stats">

        {
          loading ? <Loading />
          :
          
          <div className="statsItem">
            
            <FeedIcon className='icon article'/>

            <div className="info">
              <span className="count">{posts && posts.length > 0 ? posts.length : 0}</span>
              <span className="title">Articles</span>
            </div>
          </div>
        }

        {
          loading ? <Loading />
          :
          <div className="statsItem">
            
            <GroupsIcon className='icon user'/>

            <div className="info">
              <span className="count">{users && users.length > 0 ? users.length : 0}</span>
              <span className="title">Users</span>
            </div>
          </div>
        }

        {
          loading ? <Loading />
          :
          <div className="statsItem">
            
            <AssignmentIndIcon className='icon staff'/>

            <div className="info">
              <span className="count">{employees && employees.length > 0 ? employees.length : 0}</span>
              <span className="title">Company Staff</span>
            </div>
          </div>
        }
      </div>

      {/* {
        loading === true && <Loader />
      } */}

      <div className="flex">
        <div className="top">

          {
            loading ? <Loading /> :
            employees && employees.length > 0 ?
            <div className="colItem staff">
              <h2 className="title"> Employees </h2>

              <div className="staffList">
                  {
                    employees && employees.slice(0, 3).map((item) => (
                      <div className="userItem" key={item._id}>
                        <User type={"dashboard"} user={item} fontWeight={500} /> 
                        <Role role={item.role} fontSize={12} bgColor={"#f2f2f2"} fontWeight={400} width={50}/>
                      </div>
                    ))
                  }

                  <Link className='link button user' to={"/members#top"}>View More<KeyboardArrowRightIcon className='icon'/></Link>
                
              </div>
            </div>
            :
            <div className="colItem staff">
              <h2 className="title"> Employees </h2>

              <div className="staffList">
                  no employee found
                
              </div>
            </div>

          }

          {
            loading ? <Loading /> :
            users && users.length > 0 ?
              <div className="colItem homeUsers">
                <h2 className="title"> Users </h2>

                <div className="staffList">
                    {
                      users && users.slice(0, 3).map(item => (

                        <div className="staffItem" key={item._id}>
                          <User type="dashboard" user={item} fontWeight={500}/>
                          <Role role={item.isAdmin? "admin" : "user"} width={50} 
                            bgColor={!item.isAdmin && "#8080802d"}
                            textColor={!item.isAdmin && "gray"}
                          />
                        </div>
                        
                      ))
                    }
                    <Link className='link button user' to={"/users#top"}>View More<KeyboardArrowRightIcon className='icon'/></Link>
                    
                </div>
              </div>
              :
              <div className="colItem homeUsers">
                <h2 className="title"> Users </h2>

                <div className="staffList">
                    
                    No users
                    
                </div>
              </div>

          }
        </div>

        <div className="flexItem">
          <h2 className="title">Latest Posts</h2>
          <div className="postList">

            {
              posts && posts.map((item, count) => (
                count < 3 &&
                <div className="postItem" key={item._id}>
                  <Post type="dashboard" post={item}/>
                </div>
              ))
            }

            <Link className='link button' to={"/posts#top"}>More Posts<KeyboardArrowRightIcon className='icon'/></Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home