import React from 'react';
import "./image.scss";

const Image = ({file, height, width, image}) => {
  return (
    <div className='image' style={{
        width: width,
        height: height
    }}>
        {
          file &&
          <img src={URL.createObjectURL(file)} 
          alt="Image to be uploaded" />
        }
        {
          image &&
          <img src={image} 
          alt="Image to be uploaded" />
        }
    </div>
  )
}

export default Image