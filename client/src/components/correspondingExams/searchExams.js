import React,{useContext,useRef} from 'react';
import examContext from '../../context/examContexts/AppContext';

import "../../css/Page1.css";

const ExamSearch = () => {

  const { clearExamByName , searchExamByName } = useContext(examContext);
  
  const searchValue=useRef('');
  
  const handleChange=(e)=>{
  
     if(searchValue.current.value!==''){
           searchExamByName(e.target.value);
      }else{
          clearExamByName();
      }
  }
  return (
    <div className="find_me">
     
      <input type="text" ref={searchValue} className="search" placeholder=" Search Exam by name ..." onChange={handleChange} />
     
      <i className="fas fa-search search-icon"  />
    
    </div>
  )
}

export default ExamSearch