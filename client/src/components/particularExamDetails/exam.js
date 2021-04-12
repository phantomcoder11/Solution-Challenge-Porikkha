import React , { useEffect , useState , useContext , useRef , lazy , fallback, Suspense } from "react";
import "../../css/exam.css";

import { useParams , Link } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import StudentContext from '../../context/studentContexts/StudentContext';
import Noresults from "./Noresults";
import Navbar  from '../navbar/Navbar';

import download from 'js-file-download';

const Exam=({location})=>{

    const { _id } = useParams();

    const [ exam , setExam ] = useState(null);

    const [ studentsLength , setStudentLength ] = useState(0);

    const [ _status , setStatus ] = useState(-1);

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

       const { status } = queryString.parse(location.search);

       setStatus(status);
      
       const fetchData = async ()=>{

        let response;

        if(parseInt(status)===1){
            response = await axios.get(`/exam/getExamDetails/${_id}`);
       
        }else if(parseInt(status)===2){
        
            response = await axios.get(`/objective_exam/getExamDetails/${_id}`);
        }

       // console.log(response);

        await setExam(response.data.exam);

        setStudentLength(response.data.students.length);

        await getCheckStatus();

        await getStudents(_id,status);
       }
       fetchData();
    }, [location.search])

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

    const Export_List = async (e)=>{

      if(parseInt(_status)===1){

        const downloadFile = () => {
        
           axios.get(`/exam/getStudentsExcel/${_id}`)
        
            .then(resp => {
          
                  download(resp.data,'students.xlsx');
           });
       }

       downloadFile();
      
      }else if(parseInt(_status)===2){

        const downloadFile = () => {
        
           axios.get(`/objective_exam/getStudentsExcel/${_id}`)
         
             .then(resp => {
           
                   download(resp.data,'students.xlsx');
            });
        }

        downloadFile();

      }
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
                        <tr style={{background:'#F2F0F0'}} key={student._id}>
                         
                          <td>
                            { parseInt(_status)===1 ? 
                               
                               <Link onClick={()=>{storeLocal(_id)}} to={`/getStudentDetails`} style={anchorLink}>
                              
                                  {student.name}
                               </Link> :
    
                               <Link to={`/Final_Submission?_id=${_id}&studentId=${student._id}`} style={anchorLink}>
                              
                                {student.name}
                             </Link>
                            } 
                          </td> 
                         
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
                 
                      <tr style={{background:'#F2F0F0'}} key={student._id}>
                    
                        <td>


                        { parseInt(_status)===1 ? 
                               
                               <Link onClick={()=>{storeLocal(student._id)}} to={`/getStudentDetails`} style={anchorLink}>
                              
                                  {student.name}
                               </Link> :
                               <Link to={`/Final_Submission?_id=${_id}&studentId=${student._id}`} style={anchorLink}>
                              
                                {student.name}
                             </Link>
                            } 
                        </td>
                    
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
{ parseInt(_status)===1 ? 
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
  : null}

   <div>

      <button className='SEfinal' onClick={Export_List}>
          Export Student List
      </button>
   </div>
  
  </div>
 </div>
</div>
</div>)
}
export default Exam;