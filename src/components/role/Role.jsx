import React from 'react';
import "./role.scss";

const Role = ({role, margin, fontWeight, textColor, bgColor, width, fontSize}) => {
    return (
        <div className="role" style={{margin: margin}}>
            <span style={{backgroundColor: bgColor, fontSize: fontSize,fontWeight: fontWeight, color: textColor, width: width}} 
            className={`roleText ${role}`}>{role}</span>
        </div>
    )
}

export default Role