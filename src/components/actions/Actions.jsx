import React from 'react';
import "./actions.scss";
import PreviewIcon from '@mui/icons-material/Preview';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

const Actions = ({pin, unpin, view, data, edit, remove, promote, demote,pinAction, unPinAction,  promoteAction, demoteAction, viewAction, deleteAction, editAction, setValue}) => {


    const action = () => {
        viewAction();
        setValue(data);
    }

    
    
  return (
    <div className='actions'>
        
        {
            promote && 
            <Tooltip title={"Promote to admin"} arrow placement='bottom'>
                <span className="action promote" onClick={promoteAction}>
                    <ThumbUpAltOutlinedIcon className='icon promote'/>
                </span>         
            </Tooltip>

        }
        {
            pin && 
            <Tooltip title={"Pin story"} arrow placement='bottom'>
                <span className="action pin" onClick={pinAction}>
                    <PushPinOutlinedIcon className='icon pin'/>
                </span>         
            </Tooltip>

        }
        {
            unpin && 
            <Tooltip title={"Unpin story"} arrow placement='bottom'>
                <span className="action unpin" onClick={unPinAction}>
                    <PushPinOutlinedIcon className='icon unpin'/>
                </span>         
            </Tooltip>

        }
        {
            demote && 
            <Tooltip title={"Remove from admin"} arrow placement='bottom'>
                <span className="action demote" onClick={demoteAction}>
                    <ThumbDownAltOutlinedIcon className='icon demote'/>
                </span>         
            </Tooltip>

        }
        {
            view && 
            <Tooltip title={"View"} arrow placement='bottom'>
                <span onClick={action} className="action view">
                    <PreviewIcon className='icon view'/>
                </span>         
            </Tooltip>

        }
        {
            edit && 
            <Tooltip title={"Edit"} arrow placement='bottom'>
                <Link to={editAction} className="action edit">
                    <EditOutlinedIcon className='icon edit'/>
                </Link>         
            </Tooltip>

        }
        {
            remove && 
            <Tooltip title={"Delete"} arrow placement='bottom'>
                <span className="action delete" onClick={deleteAction}>
                    <DeleteOutlineOutlinedIcon className='icon delete'/>
                </span>         
            </Tooltip>

        }
       
    </div>
  )
}

export default Actions