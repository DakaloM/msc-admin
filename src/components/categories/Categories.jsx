import React, { useEffect, useState } from 'react';
import "./categories.scss";
import { userRequest } from '../../requestMethod';
import Loading from '../loading/Loading';

const Categories = ({setCategory, selected}) => {

    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCats = async() => {
            setLoading(true)
            try {
                const res = await userRequest.get("categories")
                setList(res.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }

        fetchCats()
    },[])



  return (

    loading? <Loading  size={20}/>
    :

    
        list && list.length > 0 && 
        <select name="category" defaultValue={selected? selected : "Select category"} id="category" onChange={(e) => setCategory(e.target.value)}>
            {
                selected ? selected : <option>Select category</option>
            }
            {
                list.map((item) => (
                    <option value={item.title} key={item._id}>{item.title}</option>
                ))
            }
            
        </select>
    
    
  )
}

export default Categories