import React,{ useState , useContext , useEffect } from 'react'

import { Link } from 'react-router-dom';

import io from 'socket.io-client';

import queryString from 'query-string';

import '../../css/mcq.css'

import McqContext from '../../context/MCQContexts/McqContext';

import axios from 'axios';

import Navbar from '../navbar/Navbar';

import Timer from '../Timer/Timer';

let socket;

const Give_quiz = ({location}) => {

    const { mcqs , fillUps , Edit_MCQ_Details , Edit_Fill_Up_Details } = useContext(McqContext);

    const [ questions , setQuestions ] = useState([]);

    const [ fillUp , setFillUp ] = useState([]);

    const [ studentDetails , setStudentDetails ] = useState({
        mcq:[],
        fillUp:[]
    });

    const [ count , setCount ] = useState(0);

    const [ countF , setCountF ] = useState(0);

    const [ answer , setAnswer ] = useState('');

    const [ _id , setId ] = useState(null);

    const [ student_id , setStudentId ] = useState(null);

    const [registered , setRegistered ] = useState(false);

    const [error,setError]=useState(null);

    const [response , setResponse] = useState('');

    const [ navigate , setNavigate ] = useState(true);

    const [ multipleChoice , setMultipleChoice ] = useState(true);

    const [ startDate , setstartDate ] = useState(0);

    const END_POINT = 'localhost:5000';

    useEffect(()=>{
        
        const fetchData = async()=>{
        
            const { name , room , scholarId , _id , email , studentId  } = queryString.parse(location.search);

            setId(_id);

            setStudentId(studentId)

            const response = await axios.get(`/objective_exam/getExamById/${_id}`);

            console.log('Response',response);

            //navigationStatus
            setNavigate(response.data.exam.navigationStatus);
            
            setMultipleChoice(response.data.exam.mcqType);

            if(response.data.error!==undefined){
               setError(response.data.error);
               return;
            }

           setQuestions(response.data.mcqs);

           setFillUp(response.data.fill_ups);

           const studentResponse = await axios.get(`/student_objective_exam/${studentId}`);

           setStudentDetails(studentResponse.data.student);

            if(studentResponse.data.error!==undefined){
               setError(studentResponse.data.error);
               return;
            }

           setRegistered(true);

           socket = io();

           socket.emit( 'joinRoom' , { username: name , room } );

           //teacher portal

           socket.on('getUsersToRoom',({room , users})=>{
               console.log(users);
           }) 

           const x = (response.data.exam.timeLength.split(":")[0]*60*60 + response.data.exam.timeLength.split(":")[1]*60 )*1000 ;

           console.log(response.data.exam.timeLength.split(":")[0] ," ",response.data.exam.timeLength.split(":")[1], x);
          
           setstartDate(response.data.exam.startTime + x);
           
           return()=>{
               socket.on('disconnect');

               //teacher portal

               socket.on('getUsersToRoom',({room , users})=>{
                   console.log(users);
               }) 
               
               socket.off();
           }
        }
        
        fetchData();

    },[location.search, END_POINT])

    const goToNextMcq = (e)=>{

        console.log(count);

        setCount(count+1);
    }

    const onSubmit = async (e)=>{

        e.preventDefault();

        let data;

        const fetchData = async ()=>{
            
            if(!( multipleChoice === 'Single Option Answer' )){
                let x = e.target.children[1].children.length;
    
                let studentResponse ='';
        
                for(let i=0 ; i<x ; i++ ){
        
                    if(e.target.children[1].children[i].children[0].checked){
                        studentResponse = studentResponse + ' ' + e.target.children[1].children[i].children[0].value;
                    }
                }
        
                const list = await studentDetails.mcq.map(res=>{
                 
                    if(parseInt(res.questionNo)===parseInt(e.target.id)){
                 
                        return{
                            ...res,
                            studentResponse:String(studentResponse)
                        }
                    }
                    return res;
                })
        
                setStudentDetails({
                    ...studentDetails,
                    mcq:list
                });
        
                data = {
                    mcq:list
                }
                console.log('mcq',list);
            }
            else{
                data = {
                    mcq:studentDetails.mcq
                }
            }
        }

        await fetchData();

        const config ={
           header:{
             'Content-type':'application/json'
          }
        }

        axios.patch(`/student_objective_exam/mcq/${student_id}`,data,config)
            
        .then((response) => {

               console.log(response.data);
               
                if(response.data.error!==undefined){
                    
                    setResponse(response.data.error);
                    
                    return;
                }
                          
        }).catch((error) => {
            
            console.log(error);
        });
    }

    const goToNextFillUp = (e)=>{

        e.preventDefault();

        setCountF(countF+1);
        
        setCount(count+1);
        
        setAnswer('');
    }

    const onSubmitFillUp = async (e) => {
        e.preventDefault();

        const data = { 
            fillUp : studentDetails.fillUp
        }

        const config ={
            header:{
              'Content-type':'application/json'
           }
         }
 
         axios.patch(`/student_objective_exam/fillUp/${student_id}`,data,config)
             
         .then((response) => {
 
                console.log(response.data);
                
                 if(response.data.error!==undefined){
                     
                     setResponse(response.data.error);
                     
                     return;
                 }
                           
         }).catch((error) => {
             
             console.log(error);
         });
    }

    const handleChangeMcq = async (e)=>{

        const list = await studentDetails.mcq.map(res=>{
         
            if(parseInt(res.questionNo)===parseInt(e.target.name)){
         
                return{
                    ...res,
                    studentResponse:e.target.value
                }
            }
            return res;
        })

        setStudentDetails({
            ...studentDetails,
            mcq:list
        });

        console.log(list);
    }

    const handleChangeFillUp = async (e)=>{

        setAnswer(e.target.value);

        const list = await studentDetails.fillUp.map(res=>{

            if(parseInt(res.questionNo)===parseInt(e.target.name)){
            
                return{
                    ...res,
                    studentResponse:e.target.value
                }
            }
            return res;
        })

        setStudentDetails({
            ...studentDetails,
            fillUp:list
        });

        console.log(list);
    }

    const handleClickMcq = (e)=>{

        if(!navigate){
            return;
        }
       
        setCount(e.target.id-1);

        setCountF(0);
    }

    const handleClickFillUp = (e)=>{

        if(!navigate){
            return;
        }
        
        setCountF( e.target.id - 1 );

        setCount( e.target.id - 1 + questions.length ); 
    }

    const flexQuestion = {
        height:'40px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center',
        marginLeft:'20px'
    }

    const flexBox = {
       marginTop:'25px',
       width:'25vw',
       display:'flex',
       alignItems:'center',
       flexWrap:'wrap',
       minHeight:'1vh',
       paddingBottom:'10px'
    }

    return (

     <div style={{width:'100vw', fontFamily:'sans-serif',overflowX:'hidden'}}>

        <Navbar />

        <div  className='containerMcqForm MCQ3rd'>
            <h1 style={{ transform:'translateX(0%)' }}>Give Quiz</h1>

            { response!=='' ? response : '' }

            <div style={{ position:'absolute' , marginTop:'30vh',marginLeft:'65vw' }}>
               
               <h2 style={{textAlign:'center'}}>Time Remaining : </h2>
               
               <Timer startDate={startDate}/>
            </div>

            <div>
                <div style={{position:'absolute',marginTop:'-18vh',marginLeft:'20vw',padding:'10px',background:'#EFEFEF'}}>
                  
                  <h2 style={{textAlign:'center'}}>Mcq</h2>
                  
                  <div style={flexBox}>
                   
                    { studentDetails.mcq.map(q=>
                  
                      <div style={flexQuestion}>
                         <span style={{padding:'10px'}}>{q.questionNo}</span>
                      
                         <button id={q.questionNo} onClick={handleClickMcq}>{parseInt(q.studentResponse)===-1 ? 'NA' : 'A'}</button>
                                           
                       </div>
                
                     )}
                   </div>
                </div>
                
                <div style={{position:'absolute',marginTop:'-18vh',marginLeft:'-45vw',padding:'10px',background:'#EFEFEF'}}>

                   <h2 style={{textAlign:'center'}}>Fill Up</h2>
                   
                   <div style={flexBox}>
                       
                    {studentDetails.fillUp.map(q=>
                  
                     <div style={flexQuestion}>
                        
                          <span style={{padding:'10px'}}>{q.questionNo}</span>
                   
                          <button id={q.questionNo} onClick={handleClickFillUp}>{parseInt(q.studentResponse)===-1 ? 'NA' : 'A'}</button>               
                     </div>
                   )}

                   </div>

                </div>
            </div>

           { count < questions.length ?
               
               <form key={questions[count].questionNo} onSubmit={onSubmit} id={questions[count].questionNo}>
                  
                  <div>

                    <span style={{fontSize:'160%'}}>Question No: {questions[count].questionNo}</span>
                        
                    <input style={{background:'#EFEFEF',marginTop:'10px',textAlign:'left'}} type='text' name='question' value={questions[count].question} />
                                            
                   </div>
                   <div className='enteroptions'style={{marginTop:'10px', marginBottom:'10px'}}>

                    { questions[count].options.map(op=>

                            <label style={{marginLeft:'20px'}}>{op.option}

                            { multipleChoice === 'Single Option Answer' ? 
                            
                             studentDetails.mcq[count]!==undefined && parseInt( studentDetails.mcq[count].studentResponse ) === op.optionNo ?
                               
                               <input type="radio"  style={{background:'#EFEFEF'}}  name={questions[count].questionNo} key={op.optionNo} value={op.optionNo} onChange={handleChangeMcq} checked/>
                            :  
                               <input type="radio"  style={{background:'#EFEFEF'}}  name={questions[count].questionNo} key={op.optionNo} value={op.optionNo} onChange={handleChangeMcq} />
                            :

                            studentDetails.mcq[count]!==undefined && String(studentDetails.mcq[count].studentResponse).split(' ').includes(String(op.optionNo))
                            ?
                            <input 
                                type="checkbox"   
                                style={{background:'#EFEFEF'}}  
                                name={questions[count].questionNo} 
                                key={op.optionNo} 
                                value={op.optionNo} 
                                checked='false'
                            /> :
                            <input 
                                type="checkbox"   
                                style={{background:'#EFEFEF'}}  
                                name={questions[count].questionNo} 
                                key={op.optionNo} 
                                value={op.optionNo} 
                            />
                            }
                         </label>
             
                     )  }
                   </div>

                   <div style={{display:'flex',justifyContent:'space-around'}}>

                      <button type="submit" className='SEfinal' style={{borderRadius:'10px',padding:'7px'}}>Submit</button> 
           
                      <button onClick={goToNextMcq} className='SEfinal' style={{borderRadius:'9px',padding:'7px'}}>Next Question</button>          
                    
                    </div>

                </form>  
            : ( count - questions.length) < fillUp.length ? 
            
              <form key={fillUp[countF].questionNo} onSubmit={onSubmitFillUp} id={fillUp[countF].questionNo}>
                    
                    <span style={{fontSize:'160%'}}>Fill Up : {fillUp[countF].questionNo}</span>

                    <input style={{background:'#EFEFEF',marginTop:'10px',marginBottom:'10px'}} type='text' name={fillUp[countF].questionNo} value={fillUp[countF].question} /> 
                    
                    { studentDetails.fillUp[countF]!==undefined && parseInt( studentDetails.fillUp[countF].studentResponse ) !== -1 ?
                 
                         <input style={{background:'#EFEFEF'}}  name={fillUp[countF].questionNo} value={studentDetails.fillUp[countF].studentResponse} placeholder='your answer..' onChange={handleChangeFillUp}/>
                     :  
                         <input style={{background:'#EFEFEF'}}  name={fillUp[countF].questionNo} value={answer} placeholder='your answer..' onChange={handleChangeFillUp}/>
                    }
                    
                    <div style={{display:'flex',justifyContent:'space-around'}}>
                        
                       <button type="submit" className='SEfinal' style={{borderRadius:'10px',padding:'7px'}}>Submit</button> 
           
                       <button onClick={goToNextFillUp} className='SEfinal' style={{borderRadius:'9px',padding:'7px'}}>Next Question</button>          
  
                    </div>
              </form>  

            : <button>Your exam is over</button> }

            <div style={{position:'absolute',top:'80vh',transform:'translateX(-10%)'}}>
               
               <Link to={`/Final_Submission?_id=${_id}&studentId=${student_id}`}>
               
                    <button className='SEfinal' style={{width:'200px',padding:'10px'}}>Final Submittion</button>
               
               </Link>
            </div>
     </div>
    </div>
    )
}

export default Give_quiz