import React, { useState } from 'react';
import "./testimony.scss";
import Rating from '../rating/Rating';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import Loading from '../loading/Loading';

const Testimony = ({test}) => {

    

  return (
        
        <div className='testimony'>
            <div className="imgContainer">
                <img src={test.image} alt="Testimony Image" />
            </div>
            <div className="group">
                <span className="name">{test.name}</span>
                <Rating label={false} number={test.rating}/>
            </div>

            <div className="text">

                <FormatQuoteOutlinedIcon className='icon'/>
                <p className='desc'>{test.desc}</p>
                <FormatQuoteOutlinedIcon className='icon'/>
            </div>

        </div>
  )
}

export default Testimony