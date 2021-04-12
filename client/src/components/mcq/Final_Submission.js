import React,{ useState , useEffect , useContext } from 'react'

import { Link } from 'react-router-dom';

import '../../css/mcq.css';

import queryString from 'query-string';

import axios from 'axios';

import Navbar from '../navbar/Navbar';

import McqContext from '../../context/MCQContexts/McqContext';

const Final_Submission = ({location}) => {

    const { mcqs , fillUps } = useContext(McqContext);

    const [ questions , setQuestions ] = useState([]);

    const [ fillUp , setFillUp ] = useState([]);

    const [ count , setCount ] = useState(0);

    const [ _id , setId ] = useState(null);

    const [ student_id , setStudentId ] = useState(null);

    const [ studentDetails , setStudentDetails ] = useState({
        mcq:[],
        fillUp:[]
    });

    const [ studentResponseMcq , setStudentResponseMcq ] = useState([]);

    const [ studentResponseFillUp , setStudentResponseFillUp ] = useState([]);

    const [ multipleChoice , setMultipleChoice ] = useState(false);

    useEffect(()=>{
        const fetchData = async () => {
        
            const { _id , studentId  } = queryString.parse(location.search);

            setId(_id);

            setStudentId(studentId);

            const response = await axios.get(`/objective_exam/getExamById/${_id}`);

            console.log(response);

            setMultipleChoice(response.data.exam.mcqType);

            if(response.data.error!==undefined){
            //    setError(response.data.error);
               return;
            }

           setQuestions(response.data.mcqs);

           setFillUp(response.data.fill_ups);

           const studentResponse = await axios.get(`/student_objective_exam/${studentId}`);

           setStudentDetails(studentResponse.data.student);

            if(studentResponse.data.error!==undefined){
              
              // setError(studentResponse.data.error);
              
               return;
            }

            let studentResponsesMcq=[];

            studentResponse.data.student.mcq.map(res=>{
                studentResponsesMcq.push(res.studentResponse.substring(1));
            })

            setStudentResponseMcq(studentResponsesMcq);

            let studentResponsesFillUp=[];

            studentResponse.data.student.fillUp.map(res=>{

                studentResponsesFillUp.push(res.studentResponse);
            })

            setStudentResponseFillUp(studentResponsesFillUp);

            const correctQs = await response.data.mcqs.filter(q=>{
              
                return q.correct_answer == studentResponsesMcq[q.questionNo-1];
            })

            const correctFillUps = await response.data.fill_ups.filter(q=>{
              
                return q.correct_answer == studentResponsesFillUp[q.questionNo-1];
            })
    
            let TotalMarksAwarded =await correctQs.reduce((acc, q) => (
              
                acc + parseInt(q.marks)
             ), 0)

            TotalMarksAwarded =await correctFillUps.reduce((acc, q) => (
              
                acc + parseInt(q.marks)
             ), TotalMarksAwarded)
    
             setCount(TotalMarksAwarded);

            const data = {
                marks : TotalMarksAwarded
            }
    
            const config ={
               header:{
                 'Content-type':'application/json'
              }
            }
    
            await axios.patch(`/student_objective_exam/marks/${studentId}`,data,config);
        }
        fetchData()
    }, [location.search])

    return (
      <div style={{width:'100vw', fontFamily:'sans-serif',overflowX:'hidden'}}>

        <Navbar />

        <div  className='containerMcqForm MCQ3rd'>
            <h1 style={{transform:'translateX(0%)'}}>Get Answers Checked</h1>

            {questions.map(q=>
               <div style={{width:'50vw',marginBottom:'20px'}}>
                  
                     <div>
                        <span style={{fontSize:'160%'}}>Question No: {q.questionNo}</span>
        
                        <input style={{background:'#EFEFEF',marginTop:'10px',textAlign:'left'}} type='text' name='question' value={q.question} />
                             
                     </div>
                   <div className='enteroptions'style={{marginTop:'10px', marginBottom:'10px'}}>
                    
                    {q.options.map(op=>

                       <label style={{marginLeft:'20px'}}>{op.option}

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
                   <div>
                       <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={`Correct Answer : ${ q.correct_answer }`} required />
                       <input style={{background:'#EFEFEF'}} type='text' value={`Your Response : ${ studentResponseMcq[q.questionNo-1] }`} required />

                       <input style={{background:'#EFEFEF'}} type='text' value= {  q.correct_answer == studentResponseMcq[q.questionNo-1] ? `Correct : Marks Awarded: ${q.marks}` : `Wrong : Marks Awarded: 0` } />
                   </div>
               </div> )}

               { fillUp.map(q=>
                    
                    <div style={{width:'50vw',marginBottom:'20px'}}>

                          <span style={{fontSize:'160%'}}>Fill Up : {q.questionNo}</span>
    
                          <input style={{background:'#EFEFEF',textAlign:'left',marginTop:'15px',marginBottom:'15px'}} type='text' name='question' value={q.question} placeholder='Enter FILL up' required />    

                         <div>
                             
                             <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={`Correct Answer : ${ q.correct_answer }`}/>
                             
                             <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={`Your Response : ${ studentResponseFillUp[q.questionNo-1] }`} />
                             
                             <input style={{background:'#EFEFEF'}} type='text' value= {  q.correct_answer == studentResponseFillUp[q.questionNo-1] ? `Correct : Marks Awarded: ${q.marks}` : `Wrong : Marks Awarded: 0` } />
                        </div>

                    </div>
              ) }

            
        <div>
            <button className='SEfinal' style={{width:'200px',padding:'10px'}}>
                Marks Given : { count }
            </button>

            <Link to='/login'>
                <button className='SEfinal' style={{width:'200px',padding:'10px'}}>Exam Done</button>
            </Link>
       </div>

     </div>
    </div>
    )
}

export default Final_Submission
