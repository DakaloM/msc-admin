import React from 'react';
import "./pageHeader.scss";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

const PageHeader = ({title, desc}) => {
  return (
    <div className='pageHeader'>
        <h1 className='title'>{title}</h1>
        <div className="texts">
            <span className='text'>Admin</span>
            <KeyboardArrowRightOutlinedIcon className='icon'/>
            <span className='desc'>{desc}</span>
        </div>
    </div>
  )
}

export default PageHeader