import React,{ useState , useEffect , useContext } from 'react'
import {Link} from 'react-router-dom';

import queryString from 'query-string';

import '../../css/mcq.css'

import McqContext from '../../context/MCQContexts/McqContext';

import Navbar from '../navbar/Navbar';

const Fill_mcq_questions = ({location}) => {

    const [ _id , setId ] = useState('');

    const [ name , setName ] = useState('');

    const [ room , setRoom ] = useState('');

    useEffect(()=>{
        
        const fetchData = async()=>{
        
            const { name , room , _id  } = queryString.parse(location.search);

            setId(_id);

            setName(name);
            
            setRoom(room);
        }
        
        fetchData();

    },[location.search])

    const { mcqs , fillUps , AddFillUps , AddMcqs , Edit_MCQ_Details , Edit_Fill_Up_Details } =  useContext(McqContext);

    const [ questions , setQuestions ] = useState(mcqs);

    const [ fillUp , setFillUp ] = useState(fillUps);

    // const [ fileD , setFileD ] = useState(null); 

    // const [ response , setResponse ] = useState(null);

    const mcqQuestion = {
        questionNo:mcqs.length+1,
        question:'',
        noOfOptions:'',
        options:[{
           optionNo:1,
           option:''
        }],
        correct_answer:'',
        student_response:'',
        marks:''
        // mcqPaperType:'',
        // mcqPaper:null
    }

    const fillUpQuestion={
        questionNo:fillUps.length+1,
        question:'',
        correct_answer:'',
        student_response:'',
        marks:''
    }

    useEffect(()=>{
        const fetchData = () => {
            setQuestions([
                ...mcqs,
                mcqQuestion
            ])
    
            setFillUp([
                ...fillUps,
                fillUpQuestion
            ])
        }
        fetchData()
    }, [mcqs,fillUps])

    // const setFile = (e)=>{
    //     setFileD(e.target.files[0]);
    // }

    const handleChangeMcq = async (e)=>{

        console.log(e.target.parentElement.parentElement.id);

        const list = await questions.map(q=>{
          
            if(parseInt(q.questionNo) === parseInt(e.target.parentElement.parentElement.id)){

                if(e.target.name==='options'){
                    
                    let list1 = q.options.map(op=>{
                       
                        if(parseInt(op.optionNo) === parseInt(e.target.id)){
                            return {
                                ...op,
                                option:e.target.value
                            }
                        }
                        else{
                            return op;
                        }
                    })
                    return {
                       ...q,
                       options:list1
                    }
                }

                if(e.target.name === 'noOfOptions'){
                    
                    let list2 = [];
                    
                    for(let i=0 ; i<e.target.value ; i++ ){
                        list2.push({
                            optionNo:`${i+1}`,
                            option:''
                        })
                    }
                    return{
                        ...q,
                        noOfOptions:e.target.value,
                        options:list2
                    }
                }

                if( e.target.name==='question' || e.target.name==='correct_answer' || e.target.name==='marks' ){

                 return {
                     ...q,
                     [e.target.name]:e.target.value
                 }
               }
            }
            else{
                return q;       
            }
        })
        await setQuestions(list);
        console.log(list);
    }

    const handleChangeFillUp = async (e)=>{

        const list = await fillUp.map(q=>{
          
            if(parseInt(q.questionNo) === parseInt(e.target.parentElement.id)){
                 return {
                    ...q,
                    [e.target.name]:e.target.value
                 }
            }
            else{
                return q;      
            }
        })
        await setFillUp(list);
        console.log(list);
    }

    const onSubmit=async (e)=>{

        e.preventDefault();

    //     if(fileD && !(fileD.type==='image/png' || fileD.type==='image/jpg' || fileD.type==='image/jpeg' )){
        
    //         setResponse(`Please Upload a image or pdf less than 1MB `);
    //         return;
    //     }

    //    if(fileD && fileD.size>100000){
       
    //        setResponse(`Please Upload a image or pdf less than 100kb ${fileD.size} kb is not allowed`);
    //        return;
    //     }
        
        if( parseInt( e.target.id ) === parseInt( questions.length )){
    
            console.log("question",questions[e.target.id-1]);

            await AddMcqs(questions[e.target.id-1] , _id);
            // await AddMcqs(questions[e.target.id-1],fileD);
    
            await setQuestions([...mcqs,mcqQuestion]);

            console.log("mcqs",mcqs);

            console.log("Questions",questions);

        }else{
            //edit
            await Edit_MCQ_Details( questions[e.target.id-1] );
 
            await setQuestions(mcqs);
        }

        console.log(questions);
    }

    const onSubmitFillUp = async (e)=>{
       
        e.preventDefault(e.target.id);

        if( parseInt( e.target.id ) === parseInt( fillUp.length )){

           await AddFillUps(fillUp[e.target.id-1] , _id);

           await setFillUp([...fillUps,fillUpQuestion]);
        
        }else{
           await Edit_Fill_Up_Details(fillUp[e.target.id-1] );

           await setFillUp(fillUps);
       }
        console.log(fillUp);
    }

    return (
        <>
            <Navbar />
           <div className='containerMcqForm MCQ3rd' style={{overflowY:'none'}} >
           
            <h1 style={{transform:'translate(0%,50%)',marginTop:'0vh',fontSize:'2.1rem'}}>Fill_mcq_questions</h1>

            {questions.map(q=>
              <form key={q.questionNo} id={q.questionNo} onSubmit={onSubmit}>
                  
                   <div>
                      <span style={{fontSize:'160%'}}>{q.questionNo}.</span><br></br>
                   
                      <input style={{background:'#EFEFEF'}} type='text' name='question' value={q.question} placeholder='Enter question' onChange={handleChangeMcq} />

                      {/* <input type='file' name='questionFile' placeholder='Add Question as Image' onChange={setFile}/>     */}
                     
                      <input style={{background:'#EFEFEF'}}  type='Number' name='noOfOptions' value={q.noOfOptions} placeholder='Enter no of options' required onChange={handleChangeMcq} /> 
                    </div>
                    <div className='enteroptions'>
                       {q.options.map(op=>
                           <input style={{background:'#EFEFEF',marginLeft:'5px'}}  key={op.optionNo} id={op.optionNo} name='options' value={op.option} placeholder='Enter options'  required onChange={handleChangeMcq}  />
                        )}
                    </div> 
                    <div>
                        <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={q.correct_answer} placeholder='Correct Options.Use space for multiple choice : e.g. 1 2' required onChange={handleChangeMcq} />    
                         
                        <input style={{background:'#EFEFEF'}}  type='Number' name='marks' value={q.marks} placeholder='Enter Marks' required onChange={handleChangeMcq} />    
                    </div>
                    <button style={{width:'60%',marginBottom:'10%',margin:'auto',transform:'translateX(30%)',left:'20%',background:'#EFEFEF',padding:'5px'}}   type="submit">{parseInt( q.questionNo ) === parseInt( questions.length ) ? 'Add Question' : 'Edit Question' }</button>          
              </form>   
            )}
            
            <h1 style={{transform:'translate(0%,50%)',fontSize:'2.1rem'}}>Fill_up_the_blanks</h1>

            {fillUp.map(q=>
            
              <form key={q.questionNo} onSubmit={onSubmitFillUp} id={q.questionNo}>
              
                  <span style={{fontSize:'160%'}}>{q.questionNo}.</span><br></br>
              
                  <input style={{background:'#EFEFEF'}} type='text' name='question' value={q.question} placeholder='Enter FILL up' required onChange={handleChangeFillUp} />    
                  
                  <input style={{background:'#EFEFEF'}} type='text' name='correct_answer' value={q.correct_answer} placeholder='Enter Correct Option' required onChange={handleChangeFillUp} />    

                  <input style={{background:'#EFEFEF'}} type='Number' name='marks' value={q.marks} placeholder='Enter Marks' required onChange={handleChangeFillUp} />    
                  
                  <button style={{width:'60%',marginBottom:'15%',border:'1px solid grey',margin:'auto',transform:'translateX(30%)',left:'20%',background:'#EFEFEF',padding:'5px'}} type="submit">{parseInt( q.questionNo ) === parseInt( fillUp.length ) ? 'Add Question' : 'Edit Question' }</button>          
              </form>   
            )}
            
            <Link to={`/Classhall_Teacher?name=${name}&room=${room}&_id=${_id}`}>
                    <button className="SEfinal" style={{marginBottom:'5%',transform:'translateX(-10%)', width:'300px'}}>Go to Exam Hall Section</button>
            </Link>
            
            <div style={{height:'5vh'}}></div>
        </div>
        </>
    )
}

export default Fill_mcq_questions
