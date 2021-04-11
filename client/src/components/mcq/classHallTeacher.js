import React,{ useState , useEffect , useContext } from 'react';

import {Link} from 'react-router-dom';

import queryString from 'query-string';

import '../../css/mcq.css'

import McqContext from '../../context/MCQContexts/McqContext';

import axios from 'axios';

import io from 'socket.io-client';

import Timer from '../Timer/Timer';

import Navbar from '../navbar/Navbar';

let socket;

const ClassHallTeacher = ({location}) => {

    const [ _id , setId ] = useState('');

    const [ name , setName ] = useState('');

    const [ room , setRoom ] = useState('');

    const [examName , setExamName] = useState('');

    const [ usersInRoom , setusersInRoom ] = useState([]);

    const [ questions , setQuestions ] = useState([]);

    const [ fillUp , setFillUp ] = useState([]);

    const [error,setError]=useState(null);

    const [ startDate , setstartDate ] = useState(0);

    const [ multipleChoice , setMultipleChoice ] = useState(false);

    const END_POINT = 'localhost:5000';

    useEffect(()=>{
        
        const fetchData = async()=>{
        
            const { name , room , _id  } = queryString.parse(location.search);

            setId(_id);

            setName(name);
            
            setRoom(room);

            const response = await axios.get(`/objective_exam/getExamById/${_id}`);

            console.log(response);

            setMultipleChoice(response.data.exam.mcqType);

            setExamName(response.data.exam.name);

            if(response.data.error!==undefined){
               setError(response.data.error);
               return;
            }

           setQuestions(response.data.mcqs);

           setFillUp(response.data.fill_ups);

           const x = (response.data.exam.timeLength.split(":")[0]*60*60 + response.data.exam.timeLength.split(":")[1]*60 )*1000 ;

            console.log(response.data.exam.timeLength.split(":")[0] ," ",response.data.exam.timeLength.split(":")[1], x);
          
            setstartDate(response.data.exam.startTime+ x);


            socket = io();

            console.log(socket);
 
            socket.emit( 'joinRoom' , { username: name , room } );
 
            //teacher portal
 
            socket.on('getUsersToRoom',({room , users})=>{
                setusersInRoom(users);
            }) 
            
            return()=>{
                socket.on('disconnect');
 
                //teacher portal
 
                socket.on('getUsersToRoom',({room , users})=>{
                    setusersInRoom(users);
                }) 
                
                socket.off();
            }
         }
         
         fetchData();
 
     },[location.search, END_POINT])

    const container = {
        width:'100vw',
        display:'flex',
        allignItems:'center',
        justifyContent:'spaceAround',
        marginLeft:'50vw'
    }

    return (
        <div style={{width:'100vw', fontFamily:'sans-serif',overflowX:'hidden'}}>

        <Navbar />

        <div className='containerMcqForm MCQ3rd'>

            <h1 style={{ marginLeft:'50vw' , transform:'translateX(-55%)' }}>Exam Name: {examName}</h1>

            <div style={container}>

              <div style={{marginLeft:'-20vw'}}>

                {questions.map(q=>
                  <div style={{marginTop:'20px',width:'50vw'}}>
    
                     <div>
                        <span style={{fontSize:'160%'}}>Question No: {q.questionNo}</span>
        
                        <input style={{background:'#EFEFEF',marginTop:'10px',textAlign:'left'}} type='text' name='question' value={q.question} />
                             
                     </div>
                   <div>
                   <div className='enteroptions'style={{marginTop:'10px', marginBottom:'10px'}}>
                 
                       {q.options.map(op=>

                       <label style={{marginLeft:'20px'}}>{op.option}

                          {/* { parseInt( op.optionNo ) === parseInt( q.correct_answer ) ?                  */}
                          
                          { q.correct_answer.split(' ').includes(String(op.optionNo)) ?                 


                           <input 
                               style={{background:'#EFEFEF'}} 
                               type={ multipleChoice == 'Single Option Answer' ? "radio" : "checkbox" }  
                               name={q.questionNo} 
                               key={op.optionNo} 
                               value={op.optionNo} 
                               checked='true'
                            />

                           :  <input 
                               style={{background:'#EFEFEF'}} 
                               type={ multipleChoice == 'Single Option Answer' ? "radio" : "checkbox" }  
                               name={q.questionNo} 
                               key={op.optionNo} 
                               value={op.optionNo} 
                               />
                           }
             
                       </label>
                      )}
                   </div>
             </div>
             <div>
               <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={`Correct Answer : ${ q.correct_answer }`} required />
             </div>
        </div> )}

      { fillUp.map(q=>
      
         <div style={{marginTop:'20px',width:'50vw'}}>
             
             <span style={{fontSize:'160%'}}>Fill Up : {q.questionNo}</span>
    
             <input style={{background:'#EFEFEF',textAlign:'left',marginTop:'15px',marginBottom:'15px'}} type='text' name='question' value={q.question} placeholder='Enter FILL up' required />    

             <div>
                <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={`Correct Answer : ${ q.correct_answer }`} required />   
             </div>

         </div>
       ) }

   </div>

   <div style={{color:'black',marginLeft:'15vw'}}>

      <div>
          <h2 style={{textAlign:'center'}}>Time Remaining : </h2>
          <Timer startDate={startDate}/>
      </div>
      
      <div style={{marginTop:'40px'}}>
         <h2 className="tExam " style={{color:'black',textAlign:'center'}} >Student List</h2>

         <table className="tExamstudentList" style={{color:'black'}}>

            <th style={{paddingRight:'100px',color:'black'}}>Name</th>
            <th>Status</th>


            {usersInRoom.map((user)=><tr key={user.id}>

               <td>{user.username}</td>

               <td>{user.status===true?"True":"False"}</td>

            </tr>)} 

        </table>
      </div>
   </div> 
  </div>
 </div>
</div>

)
}

export default ClassHallTeacher;
