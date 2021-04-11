import React,{useState,useEffect,useContext} from "react";
import "../../css/Page1.css";
import { Link , useParams } from "react-router-dom";
import Navbar from '../navbar/Navbar';
import SearchExam from './searchExams';

import AppContext from '../../context/examContexts/AppContext';
import LoaderC from "./LoaderC";
import Noresults from './Noresults';

import axios from 'axios';

const Exam=()=>{

    const { _id } = useParams();

    const [ exams , setExams ] = useState(null);

    const [ objExams , setObjExams ] = useState(null);

    const [ error , setError ] = useState('');

    const { getCorrespondingExams , search , correspondingExams } = useContext( AppContext );
    
    useEffect( () => {

           const fetchData3 = async ()=>{
            await getCorrespondingExams(_id);

            await setExams(correspondingExams);
 
            console.log(correspondingExams);

            const response = await axios.get(`/classroom/mcq/${_id}`);

            if(response.data.msg!==undefined){

                setError(response.data.msg);
                
                return;
            }
            
            setObjExams(response.data.obj_exams);

            console.log(response.data.obj_exams);
            }
            fetchData3();

    }, [correspondingExams])

    return (
        <>
            <Navbar />
            <div className="Page1">
                    <div className="lev1">
                        <SearchExam className="box1"></SearchExam> 
                        <div className="box2">
                            <h2><Link to = {`/exam/create/${_id}`} >Create Exam</Link></h2>
                        </div>
                    </div>
                    <div className="history" >
                        <h4 style={{color:'black',fontWeight:'bold'}}>HISTORY</h4>
                    </div>
                    <div className="table">
                    <table  style={{borderRadius:'10px'}}>
                            <tr style={{color:'black',fontWeight:'bold'}}>
                                <th style={{fontWeight:'bold'}}>Exam ID</th>
                                <th style={{fontWeight:'bold'}}>EXAM DATE</th>
                                <th style={{fontWeight:'bold'}}>NAME</th>
                            </tr>
         
                            {
                               search===null && exams===null ? <LoaderC /> :

                               search!==null ? 
                               
                                search.length===0 ? 
                                
                                <Noresults /> : 
                                 search.map(exam =>(
                                   
                                    <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
                                    
                                       <td><Link to ={`/exam/details/${exam._id}`} style={{textDecoration:'none',color:'black'}}>{exam._id}</Link></td>
                                    
                                       <td style={{color:'black'}}>{exam.date.split("T")[0]}</td>
                                    
                                       <td style={{color:'black'}}>{exam.name}</td>
                                    </tr>
                                )) : 
                                 exams===null || exams.length===0 ? <Noresults /> :
                                
                                 exams.map(exam =>(
                                
                                   <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
                                   
                                       <td><Link to ={`/exam/details/${exam._id}?status=1`} style={{textDecoration:'none',color:'black'}}>{exam._id}</Link></td>
                                   
                                       <td style={{color:'black'}}>{exam.date.split("T")[0]}</td>
                                   
                                       <td style={{color:'black'}}>{exam.name}</td>
                                   
                                    </tr>
                                )) 
                            }
                           
                        </table>
                    </div>
                    <br /><br />

                    <div className="history" >
                        <h4 style={{color:'black',fontWeight:'bold'}}>MCQS</h4>
                    </div>

                    <br /><br />

                    <div className="table">
                      <table  style={{borderRadius:'10px'}}>
                            
                            <tr style={{color:'black',fontWeight:'bold'}}>
                            
                                <th style={{fontWeight:'bold'}}>Exam ID</th>
                            
                                <th style={{fontWeight:'bold'}}>EXAM DATE</th>
                            
                                <th style={{fontWeight:'bold'}}>NAME</th>
                            </tr>
         
                            {
                               objExams===null ? <LoaderC /> :
                                
                                 objExams===null || objExams.length===0 ? <Noresults /> :
                              
                                 objExams.map(exam =>(
                              
                                    <tr style={{background:'#F2F0F0',marginBottom:'20px'}}>
                                    
                                       <td><Link to ={`/exam/details/${exam._id}?status=2`} style={{textDecoration:'none',color:'black'}}>{exam._id}</Link></td>
                                    
                                       <td style={{color:'black'}}>{exam.date.split("T")[0]}</td>
                                    
                                       <td style={{color:'black'}}>{exam.name}</td>
                                    </tr>
                                )) 
                            }
                           
                        </table>
                    </div>
                    
               </div>
        </>)
}

export default Exam;