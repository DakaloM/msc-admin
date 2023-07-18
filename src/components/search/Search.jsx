import React from 'react';
import "./search.scss";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Search = ({setSearch}) => {
  return (
    <div className='search'>
      <SearchOutlinedIcon className='icon'/>
      <input type="text" placeholder='Search...' onChange={(e) => setSearch(e.target.value)} />
    </div>
  )
}

export default Search