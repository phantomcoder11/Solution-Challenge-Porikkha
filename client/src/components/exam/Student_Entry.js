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

    const handleChange = (e)=>{

        setError(null);

        setStudent({
            ...student,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        
        const response = await axios.get(`/exam/getExamByRoom/${room}`);

        if(response.data.error!==undefined){
          setError(response.data.error);
          return;
        }
        setId(response.data._id);

        setRegistered(true);
    }

    const container = {
        height:'200px',
        width:'300px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        allignItems:'center',
        marginLeft:'40vw'
    }

    return (
        
        <div className="SE_main">
          
            <Navbar />
          
            <h2  className="SEhead" >Student registration Portal</h2>
          
            <form onSubmit={onSubmit} style={container} >
                 <span className="SEtop"></span>
                 <input type='text' name='name' value={name} placeholder='your name' className="SEinput"/>
                <span className="SEtop"></span>
                <input type='Number' name='scholarId' onChange={handleChange}  placeholder='Enter your scholarId' className="SEinput"/>
                <span className="SEtop"></span>
                <input type='text' name='room' onChange={handleChange} value={room} placeholder='Enter your room name' className="SEinput"/>
                <br />           
                <input type='email' name='email' value={email} placeholder='your email' className="SEinput"/>
               
                <button type='submit' className="SEbutton" style={{marginBottom:'-40px'}}>Check if exam is still going on</button>
            </form>
            
            {error!==null ? <span style={{color:'white'}}>Error: {error}</span> : null}

            { registered===true ? 
                  <Link to={`/exam_hall?name=${name}&room=${room}&scholarId=${scholarId}&_id=${_id}&email=${email}&st=0`}><button className="SEfinal">Click to Enter Classroom</button></Link> 
             : null }

        </div>
    )
}

export default Student_Entry