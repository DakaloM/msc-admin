import React from 'react';
import "./post.scss"

const Post = ({type, post, slide}) => {


  return (
    <div className={type === "dashboard" ? `tablePost ${type}` : "tablePost"}>
        <div className="imgContainer">
            { post && post.image && <img src={post.image} alt="Post Image" />}
            { slide && slide.image && <img src={slide.image} alt="Slide Image" />}
        </div>

        {
          post && <div className="info">
                      <span className="title">{post.title}</span>
                      <span className='category'>{post.category}</span>
                      <p className='desc'>{post.story.slice(0,200)}</p>
                  </div>
        }
        {
          slide && <div className="info">
                      <span className="title">{slide.title}</span>
                      <p className='desc'>{slide.desc.slice(0,200)}</p>
                  </div>
        }
    </div>
  )
}

export default Post