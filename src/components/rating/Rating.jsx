import React from 'react';
import "./rating.scss";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';

const Rating = ({number, setNumber, label, click}) => {
  return (
    <div className='rating'>
        { label && <span className="ratingTitle">Rating:</span>}
              <div className="stars">

                  {Array(5).fill().map((_, index) => (

                    number >= index + 1 ? (
                        click ?  <StarIcon className='icon' onClick={() => setNumber(index +1)} key={index}/> : 
                            <StarIcon className='icon' key={index}/>
                    ): (
                      click ? <StarBorderOutlinedIcon  className='icon' onClick={() => setNumber(index +1)} key={index}/> :
                      <StarBorderOutlinedIcon  className='icon'  key={index}/>
                    )
                    
                  ))}
                
              </div>    
                {
                    label &&
                    <span className="feedback">
                        {
                        number === 1 ? "Not Satisfied" : number === 2? "Almost Satisfied": number === 3? "Satisfied"
                        : number === 4? "Very Satisfied" : number === 5 ? "Excellent Product" : ""
                        }
                    </span>
                }
    </div>
  )
}

export default Rating