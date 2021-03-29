import React , { useEffect , useState , useContext , useRef } from "react";
import "../../css/exam.css";

import { useParams , Link } from 'react-router-dom';
import axios from 'axios';

import StudentContext from '../../context/studentContexts/StudentContext';
import Noresults from "./Noresults";
import Navbar  from '../navbar/Navbar';

const Exam=()=>{

    const { _id } = useParams();

    const [ students , setStudents ] = useState(null);

    const [ exam , setExam ] = useState(null);

    const [ studentsLength , setStudentLength ] = useState(0);

    const { getStudents , searchStudentName , searchStudentId , clearStudent , studentsofExam , search , getCheckStatus , checkedStatus } = useContext(StudentContext);

    const searchName = useRef('');
    const searchId = useRef('');

    const handleChangeName = (e)=>{

        if(searchName.current.value!==''){
            searchStudentName(e.target.value);
       }else{
           clearStudent();
       }

    }

    const handleChangeScholarId = (e)=>{

        if(searchId.current.value!==''){
            searchStudentId(e.target.value);
       }else{
           clearStudent();
       }

    }

    useEffect(async () => {
        const response = await axios.get(`/exam/getExamDetails/${_id}`);

        await setExam(response.data.exam);

        await setStudents(response.data.students);

        setStudentLength(response.data.students.length);

        await getCheckStatus();

        await getStudents(_id);
    }, [])

    const anchorLink = {
      color:'#000',
      textDecoration:'none'
    }

    const topLebal = {
      width:'590px',
      position:'absolute',
      display:'flex',
      justifyContent:'space-around',
      alignItems:'center',
      marginTop:'-50px'
    }

    const INPUT_STYLES = {
      background:'#A7E2F3',
      border:'1px solid black'
    }

    const storeLocal=(id)=>{
      localStorage.setItem("student_id",JSON.stringify(id));
    }

    return (
      <div id='ExamId'>
      <Navbar />
      <div className="PExam">
      <h1>{exam!==null ? exam.name : 'Exam Name' }</h1>
      <div className="flex-container">
       
        <div className="flex-item-left">
       
          <input type="text" ref={searchName} placeholder="Search by name" className="search1" onChange={handleChangeName} style={INPUT_STYLES}/>
       
          <input type="Number" ref={searchId} placeholder="Search by ID" className="search2" onChange={handleChangeScholarId} style={INPUT_STYLES}/>
       
          <div className="list">
       
           <p style={{marginTop:'50px',fontWeight:'bold',fontSize:'100%'}}>Student list</p>

           <div className="table">
                    <table>
                       <tr style={{color:'black',fontWeight:'bold'}}>
                           <th style={{fontWeight:'bold'}}>Name</th>
                           <th style={{fontWeight:'bold'}}>ID</th>
                           <th style={{fontWeight:'bold'}}>Email</th>
                           <th style={{fontWeight:'bold'}}>Status</th>
                           <th style={{fontWeight:'bold'}}>Marks</th>
                        </tr>

                        { search !== null ? search.length===0 ? 
                 <Noresults /> : 
                search.map(
                  student=>(
                        <tr style={{background:'#F2F0F0'}}>
                          <td><Link onClick={()=>{storeLocal(student._id)}} to={`/getStudentDetails`} style={anchorLink}>{student.name}</Link></td> 
                          <td>{student.scholarId}</td>
                          <td>{student.email}</td>
                          <td>{student.status===false?'false':'true'}</td>
                          <td>{student.marks}</td>
                         </tr> 
                  )
                ) : 
                studentsofExam.length===0 ? 
                <Noresults /> :
                studentsofExam.map(
                  student=>(
                      <tr style={{background:'#F2F0F0'}}>
                        <td><Link onClick={()=>{storeLocal(student._id)}} to={`/getStudentDetails`} style={anchorLink}>{student.name}</Link> </td>
                        <td>{student.scholarId}</td>
                        <td>{student.email}</td>
                        <td>{student.status===false?'false':'true'}</td>
                        <td>{student.marks}</td>
                      </tr> 
                  )
                ) 
           }
    </table>
                  
  </div>


</div>
</div>
<div class="flex-item-right">
<div className="details">
    <h4 style={{marginBottom:'25px',fontWeight:'bold',fontSize:'105%'}}>Exam Details</h4>
    <table>
        <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
            <th>Exam Date</th>
            <th>{exam!==null ? exam.date.split("T")[0] : NaN}</th>
        </tr>
        <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
            <td>Student Appreared</td>
            <td>{studentsLength}</td>
        </tr>
      
    </table>
</div>
<div className="status">
    <h3 style={{marginBottom:'25px',marginLeft:'0px',fontWeight:'bold',fontSize:'105%'}}>Check Status</h3>
    <table>
        <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
            <td>Papers checked</td>
            <td>{checkedStatus}</td>
        </tr>
        <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
            <td>Papers remaining</td>
            <td>{studentsLength - checkedStatus}</td>
        </tr>
    </table>
   </div>
  </div>
 </div>
</div>
</div>)
}
export default Exam;