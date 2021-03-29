import React,{useContext,useRef} from 'react';
import classroomContext from '../../context/classContexts/classContext';

import '../../css/classhall.css';

const ClassroomSearch = () => {
  const { clearClassroom , searchClassroom} = useContext(classroomContext);
  const searchValue=useRef('');
  const handleChange=(e)=>{
      if(searchValue.current.value!==''){
           searchClassroom(e.target.value);
      }else{
          clearClassroom();
      }
  }
  return (
    <div className="main_search_bar">
     
      <input type="text" ref={searchValue} className="search" placeholder=" Search Classroom by name ..." onChange={handleChange} style={{fontSize:'1.1rem'}}/>
     
      <i className="fas fa-search search-icon" style={{color:'black'}} />
   
    </div>
  )
}

export default ClassroomSearch