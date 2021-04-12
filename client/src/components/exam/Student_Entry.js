import React,{useState} from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../css/student_entry.css';
import queryString from 'query-string';

import axios from 'axios';

const Student_Entry = ({location}) => {

    
    const { name , email } = queryString.parse(location.search);

    console.log(name,email);

    const [student,setStudent] = useState({
        room:'',
        scholarId:0,
    })

    const [registered , setRegistered ] = useState(false);

    const [error,setError]=useState(null);

    const [_id , setId ] = useState(null);

    const { room , scholarId } = student;

    const [ examMode , setExamMode ] = useState('');

    const [ studentId , setStudentId ] = useState(null);

    const handleChange = (e)=>{

        setError(null);

        setStudent({
            ...student,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async (e)=>{
        e.preventDefault();

        if(parseInt(examMode)===1000){
        
          const response = await axios.get(`/exam/getExamByRoom/${room}`);

          if(response.data.error!==undefined){
            setError(response.data.error);
            return;
          }
           setId(response.data._id);

           setRegistered(true);
        }else{
           
          const response = await axios.get(`/objective_exam/getExamByName/${room}`);

          if(response.data.error!==undefined){
            setError(response.data.error);
            return;
          }
           setId(response.data._id);

           const data = {
              name,
              scholarId,
              _id:response.data._id,
              email,
              mcqs_length:response.data.mcqs_length,
              fill_ups_length:response.data.fill_ups_length
           }

           const config = {
            header: {
              'Content-Type': 'application/json'
            }
          }
   
          const studentResponse = await axios.post(`/student_objective_exam`,data,config);
            
          if(studentResponse.data.error!==undefined){
          
            setError(`${error}` + `   ${response.data.error}`);
          
            return;
          }

           setRegistered(true);

           setStudentId(studentResponse.data.student);

        }
    }

    const container = {
        width:'300px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        allignItems:'center',
        marginLeft:'40vw',
        marginTop:'-10vh'
    }

    const handleChangeExamMode = (e)=>{
        setExamMode(e.target.value)
    }

    return (
        
        <div className="SE_main">
          
            <Navbar />
          
            <h2  className="SEhead" style={{marginTop:'0vh'}}>Student registration Portal</h2>
          
            <form onSubmit={onSubmit} style={container} >
                
                 <span className="SEtop"></span>
                
                 <input type='text' name='name' value={name} placeholder='your name' className="SEinput"/>
                
                <span className="SEtop"></span>
                
                <input type='Number' name='scholarId' onChange={handleChange}  placeholder='Enter your scholarId' className="SEinput"/>
                
                <span className="SEtop"></span>
                
                <button className="SEinput" style={{background:'#10A8EC',padding:'15px'}}>Select Exam Mode

                   <div style={{padding:'5px'}}>
                     
                     <label style={{padding:'5px',fontSize:'1.2rem'}} className='inputStyle'> Subjective
                        <input type="radio" name="exam_mode" value="1000" onChange={handleChangeExamMode} style={{marginLeft:'10px'}}/>
                     </label>
                     <span style={{padding:'10px'}}></span>
                     <label style={{padding:'5px',fontSize:'1.2rem'}} className='inputStyle'>Objective
                       <input type="radio" name="exam_mode" value="2000" onChange={handleChangeExamMode}  style={{marginLeft:'10px'}}/>
                     </label>
         
                    </div>

                </button>

                <span className="SEtop"></span>
                
                <input type='text' name='room' onChange={handleChange} value={room} placeholder='Enter your room name' className="SEinput"/>
                
                <br />           
                
                <input type='email' name='email' value={email} placeholder='your email' className="SEinput"/>
                
                <span className="SEtop"></span>
                <button type='submit' className="SEbutton" style={{marginBottom:'-40px'}}>Check if exam is still going on</button>
            </form>
            
            {error!==null ? <span style={{color:'red',fontFamily:'sans-serif',fontWeight:'bold',position:'absolute',marginLeft:'50vw',top:'30vh',transform:'translate(-50%,-50%)'}}>Error: {error}</span> : null}
           
            <div style={{marginLeft:'50vw',transform:'translateX(-22%',marginTop:'25px'}}>
                { registered===true ? 

                 parseInt(examMode)===1000 ? 

                    <Link to={`/exam_hall?name=${name}&room=${room}&scholarId=${scholarId}&_id=${_id}&email=${email}&st=0`}><button className="SEfinal">Click to Enter Classroom</button></Link> 
                    : 
                    <Link to={`/give_quiz?name=${name}&room=${room}&scholarId=${scholarId}&_id=${_id}&email=${email}&studentId=${studentId}`}><button className="SEfinal">Click to Enter Classroom</button></Link> 
                
            : null }

            </div>
        </div>
    )
}

export default Student_Entry