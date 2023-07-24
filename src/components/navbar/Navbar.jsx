import React, { useEffect } from 'react';
import "./navbar.scss";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useStateContext } from '../../context/ContextProvider';
import { useSelector } from 'react-redux';
const Navbar = () => {

  const {screenSize,setScreenSize, activeMenu, setActiveMenu} = useStateContext()
  const user = useSelector(state => state.user.currentUser)

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize)

    handleResize();

    return () =>  window.removeEventListener("resize", handleResize)
  },[])

  useEffect(() => {
    if(screenSize <= 900){
      setActiveMenu(false)
    } else {
      setActiveMenu(true)
    }

  }, [screenSize])



  return (
    <div className='navbar overFlow'>
      <span className="menu" onClick={() => setActiveMenu(prev => !prev)}>
        <MenuOutlinedIcon className='icon'/>
      </span>

      {
        activeMenu === false && 
        <div className="logo">
          <img src="/img/MSCLogo.png" alt="" />

          <div className="logoTitle">
            <h1><span className="deco">M</span>ulti</h1>
            <h1><span className="deco">S</span>olution</h1>
            <h1><span className="deco">C</span>atalyst</h1>
          </div>
        </div>
      }

      <div className="message">
        <span>Hi <span className='name'>{user.firstname + " " + user.lastname}</span>, this is your admin area</span>
      </div>
    </div>
  )
}

export default Navbar