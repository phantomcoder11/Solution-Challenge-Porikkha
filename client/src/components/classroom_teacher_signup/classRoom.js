import React,{useContext} from 'react';
import {Link} from 'react-router-dom';
import classroomContext from '../../context/classContexts/classContext';

import '../../css/classhall.css';

const ClassRoom = ({classRoom}) => {
    const {delete_classroom , changeIsOpen , changeEditDetails} = useContext(classroomContext);
    const {_id,name,strength,lastexam,examno}=classRoom;
    const EDIT_STYLES = {backgroundColor:'#00A0B3',color:'white',cursor:'pointer'}
    const DELETE_STYLES ={backgroundColor:'rgba(175, 51, 183, 0.87)',color:'white',cursor:'pointer'}
    const deleteClassroom=()=>{
      delete_classroom(_id);
    }
    const handleChange=()=>{
      changeIsOpen();
      changeEditDetails({_id,name,strength});
    }
    const noexam = "No Exam Till Date";
    return (
        <div>
            <div className="card">
            <Link to={`/exam/${_id}`} style={{textDecoration:"none",background:'#1DA6CF'}}>
              <div className="subname" style={{background:'#1DA6CF'}}>
                  {name}
              </div>
            </Link>
            <div className="contain" style={{fontSize:'1rem', fontFamily:'sans-serif',position:'relative',background:'#F2F0F0',color:'black'}}>
             <div style={{position:'absolute',top:0,right:0}}>
              <Link to='/'><button style={EDIT_STYLES} onClick={handleChange}>Edit</button></Link>
              <Link to='/'><button style={DELETE_STYLES} onClick={deleteClassroom}>Delete</button></Link>
             </div>
                <div className="CHminor"> <h4><b>Number of students {strength}</b></h4> </div>
                <div className="CHminor">  <span>Last Date of Exam : {lastexam===null? noexam : lastexam }</span> </div>
                <div className="CHminor">  <p>Number of Exams taken : {examno}</p></div>
                 </div>
              </div>
        </div>
    )
}

export default ClassRoom;