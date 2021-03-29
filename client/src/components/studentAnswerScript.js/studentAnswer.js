import React,{ useEffect, useState ,useRef} from 'react';
import axios from 'axios';
import WebViewer from "@pdftron/webviewer"
import { useParams, Link } from 'react-router-dom';
import "../../css/test.css";
import { markButton , buttonS , buttonM  , markContainerDesciption , markListStyle , questionAnswer } from './studentCSS';
import Navbar  from "../navbar/Navbar";
import {useHistory} from "react-router-dom";
import Loader from "../classroom_teacher_signup/Loader";

const StudentAnswerScript=()=>{
  const viewer =useRef();
  const history=useHistory();
  const [ count , setCount ] = useState(0);

  const [ marksList , setMarksList ] = useState(null);

  const [ pdfSrc , setPdfSrc ] = useState(null);

  const [ questionPaper , setQuestionPaper ] = useState(null);

  const [ examName , setExamName ] = useState('');

  const [ questionPaperType , setQuestionPaperType ] = useState(null);

  const [ student , setStudent ] = useState(null);

  const [ totalMarks , setTotalMarks ] = useState(0);

  const [ response , setResponse ] = useState(null);

//   const { _id } = useParams();
let _id=  JSON.parse(localStorage.getItem("student_id"));

  const arrayBufferToBase64 = (buffer)=>{
     
    var binary = '';
 
    var bytes = [].slice.call(new Uint8Array(buffer));
 
    bytes.forEach((b) => binary += String.fromCharCode(b));
 
    return window.btoa(binary);
  };
  
  useEffect(async ()=>{
      
if(_id!=undefined){
    
   const response = await axios.get(`/student/getStudentDetails/${_id}`);   

   await setStudent(response.data);

   const questionPaper = await axios.get(`/exam/getQuestionPaper/${response.data.student.owner}`);

   const base64FlagQ = `data:${questionPaper.data.exam.questionPaperType};base64,`;
           
   const imageStrQ = arrayBufferToBase64(questionPaper.data.exam.questionPaper.data);
   
   setQuestionPaper( base64FlagQ + imageStrQ );

   setQuestionPaperType(questionPaper.data.exam.questionPaperType);

   setExamName(questionPaper.data.exam.name);

   await setMarksList(response.data.student.marksDistribution);
   
   await setTotalMarks(response.data.student.marks);

   const base64Flag = `data:${response.data.student.answerPaperType};base64,`;
           
   const imageStr = arrayBufferToBase64(response.data.student.answerPaper.data);
   
   setPdfSrc( base64Flag + imageStr );




  //  pdf tron
  WebViewer(
    {
      path: 'lib',
      initialDoc:pdfSrc,
    },
    viewer.current,
  ).then((instance) => {

    const arr = new Uint8Array(response.data.student.answerPaper.data);
    const blob = new Blob([arr], { type: 'application/pdf' });
    instance.loadDocument(blob, { filename: 'myfile.pdf' });


    // const arr = new Uint8Array(pdfSrc);
    // const blob = new Blob([imageStr], { type: 'application/pdf' });
    // instance.loadDocument(blob, { filename: 'myfile.pdf' });

    const { docViewer, Annotations } = instance;
    const annotManager = docViewer.getAnnotationManager();
    docViewer.on('documentLoaded', () => {
      const rectangleAnnot = new Annotations.RectangleAnnotation();
      rectangleAnnot.PageNumber = 1;
      // values are in page coordinates with (0, 0) in the top left
      rectangleAnnot.X = 100;
      rectangleAnnot.Y = 150;
      rectangleAnnot.Width = 500;
      rectangleAnnot.Height = 600;
      rectangleAnnot.Author = annotManager.getCurrentUser();

      annotManager.addAnnotation(rectangleAnnot);
      // need to draw the annotation otherwise it won't show up until the page is refreshed
      annotManager.redrawAnnotation(rectangleAnnot);
    });
  });

}
  },[])

  const handleChange = (e)=>{
    setCount(e.target.value);
  }

  const onSubmit = async (e)=>{
    
    e.preventDefault();
    
    let marks=[];

    for(let i=0;i<count;i++){
      marks.push({ 'index' : i+1 , 'mark' : 0 });
    }

    await setMarksList(marks);

    console.log(marksList);
  }

  const changeMarks = async (e)=>{

     if(parseInt(e.target.value)<0)
       return;

     const list = marksList.map(m => {
      if(parseInt(m.index)===parseInt(e.target.name)){
        
        return{
            index:m.index,
            mark:e.target.value
          }
       }else{
        return{
          index:m.index,
          mark:m.mark
        }       
       }
     })
    await setMarksList(list);

    const total = list.reduce((acc, curr) => (
      acc + parseInt(curr.mark)
   ), 0)
    await setTotalMarks(total);

  }

  const submitMarks = async (e)=>{
      e.preventDefault();
      
      console.log('marksList',marksList);
      
      console.log('total marks',totalMarks);
      
      const config ={
        header:{
          'Content-type':'application/json'
        }
      }

      const stu = {
        marksDistribution : marksList,
        marks : totalMarks,
        status:true
      }

      console.log(stu)

      const res = await axios.patch(`/student/updateStudent/${_id}`,stu,config);

      res.data.error===null?
         setResponse('The answer Script is being checked. Click here to go back'):
         setResponse(`An error Occured ${res.data.error}`);
      
  }

  const buttonStyle =  {
    textAlign: 'center',
    padding:'1.5% 1% 1.5% 1%',
    width: '25%',
    backgroundColor: '#0093D4',
    color:'rgb(255, 255, 255)',
    border:'whitesmoke',
    border:'10px',
    borderRadius:'1vw',
    outline: 'none',
    border: '2px solid #b9babb',
    fontSize: 'large'
}

  const FormStyles = {
     marginLeft:'0vw',
     display:"flex",
     flexDirection:'column',
     justifyContent:"space-around",
     padding:'100px',
     textAlign:'center'
  }

  return (
    <div className="App">
        <Navbar />
        { marksList===null || marksList.length===0 ?
        
              <div style={FormStyles}>
                   <label style={{color:'black',paddingBottom:'40px',fontSize:'200%'}} >Enter the number of questions</label>
                   <form onSubmit={onSubmit}>
         
                        <input type='number' style={{border:'1px solid black'}} name='number' value={count} placeholder="Enter the main question Number" onChange={handleChange}/>
         
                        <button type='submit'>Create</button>
                   </form>
              <br />
              </div>
            :
            <>
            <div className="top_section_exam">
              
            <div className="details_com">
                      <div className="student_details">
                          <h3 className="title_is">Student Details</h3>
                          
                          <div className="name_editor">
                            <span>Name:</span>
                            <span className="name_is">{student===null ? '' :  student.student.name}</span>
                          </div>
                          <div className="roll_is">
                            <span>Roll No:</span>
                            <span>{student===null ? '' : student.student.scholarId}</span>

                          </div>
                          <div className="sub_is">
                            <span>Subject:</span>
                            <span>{examName}</span>
                          </div>
                        </div>
                  </div>
                  <div className="status_is_jt">
                  {response!==null?
                  <>
                    <h3>Status: Checked</h3>
                    <button id="check_goto" onClick={()=>{history.goBack()}}>{response}</button>
                  </>:<h3>Status: Unchecked</h3>}
                  </div>
                
                
            </div> 
            <div  className="status_detail_jt">
            <div  className="section_marking">
                <div  className="header_exam_section">
                 <span>Question Numbers</span>
                 
                 <span >Marks Given</span>
                </div> 
                
                  {marksList.map(c => 
                   
                    <div style={markButton} className="btn_marks">
                   
                        <button style={buttonS} key={c.index}>{c.index}</button>
                   
                        <input type='Number' name={`${c.index}`} style={buttonM} key={c.index*100} value={c.mark} onChange={changeMarks} />
                     </div>
                  )}
                  { marksList!==null ?
                      
                      <div className="tot_marks">
                      
                        <span>Total Marks</span><br/>
                      
                        <button style={{padding:'2px 3px'}}>{totalMarks}</button>
                    
                      </div>
                  : null}
                </div>  
                  
            </div>
            </>
      }
        
      
      <div className="paper_container_exam">
                
       { questionPaper !==null ?
          <embed type={questionPaperType} src={questionPaper} style={{width:'600px' , height:'1000px'}}></embed>
           : <iframe id="tExamqpaper" src="embed.pdf" width="600" height="1000"><Loader/></iframe>}  

      
       { student !==null ?
         
         
           <div className="">
            <div className="webviewer" ref={viewer}></div>
          </div>
          
         
       : <iframe id="tExamqpaper" src="embed.pdf" width="700" height="1000"></iframe>} 
      </div>
          
        <form onSubmit={submitMarks} className="submit_sheet_check">
           
           <button type='submit' style={buttonStyle}>Submit Marks</button>            
        </form>
        
        
    </div>
  );
}

export default StudentAnswerScript;