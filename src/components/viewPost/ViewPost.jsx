import React from 'react';
import "./viewPost.scss";
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

const ViewPost = ({post, slide, setOpenPost, setOpenSlide}) => {
  return (
    <div className='viewPost'>
        {
            post ? <Tooltip title={"Close"} arrow placement='bottom'>

                         
                        <span onClick={() => setOpenPost(false)} className="close">
                            <CloseIcon className='icon'/>
                        </span>
                        
                    </Tooltip>

                    :

                    <Tooltip title={"Close"} arrow placement='bottom'>

                         
                        <span onClick={() => setOpenSlide(false)} className="close">
                            <CloseIcon className='icon'/>
                        </span>
                        
                    </Tooltip>
        }
       
        <div className="postWrapper">
            <div className="imgContainer">
                {
                    slide ? <img src={slide.image} alt="" /> : <img src={post.image} alt="" />
                }
                
            </div>

            <div className="info">
                {
                    post ? <h2 className="title">{post.title}</h2> :  <h2 className="title">{slide.title}</h2>
                }
                

                {
                    post && 
                    <div className="flex">
                        <span className="cat">{post.category}</span>
                        <span className="date">{post.date}</span>
                    </div>
                }

                <div className="story">

                    { post ?
                        post.story.split("\n").map((item) => (
                            <p>{item}</p>
                        ))
                        : <p>{slide.desc}</p>
                    }

                   

                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewPost