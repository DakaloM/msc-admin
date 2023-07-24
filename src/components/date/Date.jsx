import React from 'react';
import "./date.scss";
import {format } from "date-fns"
import { DateRangeTwoTone } from '@mui/icons-material';
import { formatDate } from '../../utils/methods';



const Date = ({date}) => {
    
    return (
        <span className="date">{formatDate(date)}</span>
    )
}

export default Date