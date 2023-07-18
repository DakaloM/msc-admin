import React from 'react';
import "./user.scss";

const User = ({user, type, fontWeight, textColor}) => {
  return (
    <div className='user'>
        <div className={`imgContainer ${type}`}>
            <img src={user.image? user.image : "/img/avatar.png"} alt="User Profile Picture" />
        </div>

        <span className="name" style={{fontWeight: fontWeight, color:textColor}}>{user.firstname + " " + user.lastname}</span>


    </div>
  )
}

export default User