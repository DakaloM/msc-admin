import React, { useContext } from 'react';
import "./sidebar.scss";
import { sidebarLinks } from '../../data';
import { HashLink as Link } from 'react-router-hash-link';
import {  useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useStateContext } from '../../context/ContextProvider';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/userSlice';


const Sidebar = () => {


  const dispatch = useDispatch();

  const {activeMenu, setActiveMenu, screenSize} = useStateContext();
  const user = useSelector(state => state.user.currentUser)

  const navigate = useNavigate()
  const handleLogout = async () => {
    await localStorage.removeItem("persist:root")
    dispatch(logout())
  }

 
  return (
    <div className={activeMenu? 'sidebar' : 'sidebar collapsed'}>

      {
        screenSize <= 900 && activeMenu && 
        <span className="close"onClick={() => setActiveMenu(false)}>
           <CancelOutlinedIcon className='icon'/>
        </span>
      }
      <Link className='link' to="/">
      <div className="logo">
          <img src="/img/MSCLogo.png" alt="" />

          <div className="logoTitle">
            <h1><span className="deco">M</span>ulti</h1>
            <h1><span className="deco">S</span>olution</h1>
            <h1><span className="deco">C</span>atalyst</h1>
          </div>
      </div>
      </Link>

      <div className="links">
          <ul>
            {
              sidebarLinks.map(item => (
                <li onClick={() => setActiveMenu(screenSize <= 900 ? false : true)} key={item.id}>
                  <Link className='link' to={`${item.url}#top`}>
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))
            }
          </ul>
      </div>

      <div className="profile">
            <div className="userInfo">
              <img src="/img/avatar.png" alt="Profile Image" />
              <span className="name">{user.firstname + " " + user.lastname}</span>
            </div>

            <div className="action">
              <button onClick={handleLogout}>
                <LogoutOutlinedIcon className='icon'/>
                  Logout
              </button>

              
            </div>
      </div>
    </div>
  )
}

export default Sidebar