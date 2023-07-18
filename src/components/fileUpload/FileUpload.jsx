import React from 'react';
import "./fileUpload.scss"
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

const FileUpload = ({setFile, iconColor, setLink}) => {
  return (

        <div className="fileUpload">
            <label htmlFor="file">Upload Image: <UploadFileOutlinedIcon className='icon' style={{
                color: iconColor? iconColor : "inherit"
            }}/></label>
            <input type="file" id='file' style={{display: "none"}}  onChange={(e) => setFile(e.target.files[0])}/>
          </div>
  )
}

export default FileUpload