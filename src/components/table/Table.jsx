
import "./table.scss";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Post from "../post/Post";
import Actions from "../actions/Actions";
import User from "../user/User";
import Testimony from "../testimony/Testimony";
import Role from "../role/Role";
import Date from "../date/Date";
import { useSelector } from "react-redux";


const DataTable = ({variant, color, data, editAction,pinAction, unPinAction, viewAction, deleteAction, setValue, demoteAction, promoteAction}) => {

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const user = useSelector(state => state.user.currentUser)

 


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1c2331",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(id,name,extra, date, actions,) {
  return {id, name, extra, date, actions};
}





    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

      let rows = []

      
      if(variant === "user" ){
         for(let i = 0; i < data.length; i++){
          if(data[i]._id !== user._id) {

            rows.push(
              createData(
                  data[i]._id, 
                  <User user={data[i]}/>, 
                  <span style={{
                    color: "orange", fontWeight: "bold"
                  }} className="username">{data[i].username}</span>,
                  <Role role={data[i].isAdmin === true ? "admin" : "user"} margin={"0 auto"}/>, 
                  <Actions promote={!data[i].isAdmin} demote={data[i].isAdmin} remove="remove" 
                    promoteAction={() => promoteAction(data[i]._id)}
                    demoteAction={() => demoteAction(data[i]._id)}
                    deleteAction={() => deleteAction(data[i]._id)}
                  />
              )
            )
          }
         }
      } else if(variant === "employee"){
        for(let i = 0; i < data.length; i++) {
          rows.push(
            createData( 
              data[i]._id,
              <User user={data[i]}/>, 
              <Role role={data[i].role} margin={"0 auto"}/>, 
              <Actions edit="edit" remove="remove"
                deleteAction={() => deleteAction(data[i]._id)}
                editAction={`${editAction}/${data[i]._id}`}
              />
            )
          )
        }
      }
      else if(variant === "testimony"){
        for(let i = 0; i < data.length; i++) {
          rows.push(
            createData(
              data[i]._id,
              <Testimony test={data[i]}/>, 
              <Actions  remove="remove" deleteAction={() => deleteAction(data[i]._id)}/>
            )
          )
        }

      }
      
       else if(variant === "slide") {
  
          for(let i = 0; i < data.length; i++){
            rows.push(
              createData(
                data[i]._id, 
                <Post slide={data[i]}/>, 
                <Date date="30 May 2023" />, 
                <Actions view="view" edit="edit" remove="remove" 
                  viewAction={viewAction} setValue={setValue} data={data[i]}
                  editAction={`${editAction}/${data[i]._id}`}
                  deleteAction={() => deleteAction(data[i]._id)}

                />
              ),
            )
          
          }
        
      }
       else if(variant === "post") {
        for(let i = 0; i < data.length; i++){
          
          rows.push(createData(
            data[i]._id, 
            <Post post={data[i]} />, 
            <Date date={data[i].createdAt}/>, 
            <Actions pin={data[i].pinned === false ?true : false} unpin={data[i].pinned === true ?true : false} view="view" edit="edit" remove="remove" 
              viewAction={viewAction} setValue={setValue} data={data[i]} editAction={`${editAction}/${data[i]._id}`}
              deleteAction={() => deleteAction(data[i]._id)}
              pinAction={() => pinAction(data[i]._id)}
              unPinAction={() => unPinAction(data[i]._id)}
            
            />
          ))
        }
      }

      


      
      let headers = [];
      if(variant === "user"){
        headers = ["User","Username", "Role", "Actions"]
      }
      else if(variant === "slide"){
        headers = ["Slide",  "Actions"]
      }
      else if(variant === "post"){
        headers = ["Post", "Date", "Actions"]
      }
      else if(variant === "testimony"){
        headers = ["Testimony", "Actions"]
      }
      else if(variant === "employee"){
        headers = ["Employee","Role", "Actions"]
      }
      


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {
              headers.map((item, count) => (
                <StyledTableCell align={count !== 0 ? "center" : "left"} key={item}>{item}</StyledTableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <StyledTableRow key={row.id} hover={true}>
              <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
              {variant === "user" && <StyledTableCell align="center">{row.extra}</StyledTableCell>}
              {variant === "employee" && <StyledTableCell align="center">{row.extra}</StyledTableCell>}
              {variant === "post" && <StyledTableCell align="center">{row.extra}</StyledTableCell>}
              {variant === "testimony" && <StyledTableCell align="center">{row.extra}</StyledTableCell>}
              {variant === "post" && <StyledTableCell align="center">{row.date}</StyledTableCell>}
              {variant === "user" && <StyledTableCell align="center">{row.date}</StyledTableCell>}
              {variant === "employee" && <StyledTableCell align="center">{row.date}</StyledTableCell>}
              {variant === "user" && <StyledTableCell align="center">{row.actions}</StyledTableCell>}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        background={"black"}
        rowsPerPageOptions={[10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>

  )
}

export default DataTable