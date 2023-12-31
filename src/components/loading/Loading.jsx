import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = ({size, color}) => {
  return (
    <Box sx={{padding: "5px", display: 'flex', width: "100%", alignItems: "center", justifyContent: "center"}}>
      <CircularProgress style={{color: color? color : "orange"}} size={size}/>
    </Box>
  )
}

export default Loading