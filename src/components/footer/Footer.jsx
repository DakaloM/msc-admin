import React from 'react';
import "./footer.scss";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer'>
        <span>@copyright 2023 MSC</span>
        <span className="creator">Web design and development by <Link to="//www.dakalo.tech" className='link'>Dakalo Mbulaheni</Link></span>
    </div>
  )
}

export default Footer