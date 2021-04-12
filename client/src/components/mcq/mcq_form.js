import React,{ useState ,useContext , useEffect } from 'react'

import { Link , useParams } from 'react-router-dom';

import queryString from 'query-string';

import '../../css/mcq.css';

import axios from 'axios';

import McqContext from '../../context/MCQContexts/McqContext';

import Navbar from '../navbar/Navbar';

const Mcq_form = ({location}) => {

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

    const { GetFormCreationDetails } = useContext(McqContext);

    const [ examUpdated , setExamUpdated ] = useState(false);

    const [ response , setResponse ] = useState('');

    const [ formDetails , setFormDetails ] = useState({
        pattern:'Multiple Option Answer',
        navigation:'Yes'
    })

    const handleChange = (e)=>{
        setFormDetails({
            ...formDetails,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async (e)=>{
       
        e.preventDefault();
       
        //console.log(formDetails);

        GetFormCreationDetails(formDetails);

        const data = {
            
            navigationStatus: formDetails.navigation,

            mcqType: formDetails.pattern
        }

        const config ={
           header:{
             'Content-type':'application/json'
          }
        }

        //console.log(_id);

        axios.patch(`/objective_exam/${_id}`,data,config)
            
        .then((response) => {

               //console.log(response.data);
               
                if(response.data.msg!==undefined){
                    
                    setResponse(response.data.msg);
                    
                    return;
                }
              
                setResponse("The exam room has been Updated");

                setExamUpdated(true);
            
        }).catch((error) => {
            
            setExamUpdated(false);
           // console.log(error);
        });
    }

    const lowerContainer = {
        height:'50px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        allignItems:'center',
        textAlign:'center',
        marginTop:'-5vh'
    }

    return (
        <div style={{height:'100vh',overflow:'hidden'}}>

           <Navbar />

           <div  className='containerMcqForm MCQform2nd' >

               <h1 style={{transform:'translateX(0%)',fontWeight:'bold'}}>Mcq Form</h1>

               <form onSubmit={onSubmit} className='formData'>
    
                   <h3 style={{fontSize:'2rem',fontWeight:'bold'}}>Whether it would be single choice or multiple choice ?</h3>

              <div style={{fontSize:'1.5rem',marginTop:'-3%'}} className="options">
       
                      <label > Multiple Option Answer
        
                        <input style={{marginLeft:'20px',transform:'scale(2.2)'}} type="radio" name="pattern" value='Multiple Option Answer' onChange={handleChange}  />
                      </label>

                      <label >Single Option Answer
         
                         <input style={{marginLeft:'20px',transform:'scale(2.2)'}} type="radio" name="pattern" value='Single Option Answer' onChange={handleChange}   />
                     </label>

              </div>


              <h3 style={{fontSize:'2rem',fontWeight:'bold'}}>Would You allow students to navigate back ?</h3>

              <div className="options" style={{fontSize:'1.5rem',marginTop:'-3%'}}>
       
                 <label > Yes
                      <input style={{marginLeft:'20px',transform:'scale(2.2)'}} type="radio" name="nagigation" value="Yes" onChange={handleChange} />
               </label>

               <label > No
                     <input style={{marginLeft:'20px',transform:'scale(2.2)'}} type="radio" name="nagigation" value="No" onChange={handleChange}  />
                </label>

             </div>

             <button className="button1" style={{marginTop:'-5%',color:'white'}} type='submit'>Update Details of MCQ</button> 
         </form>

        <div style={lowerContainer} >
           { response!==''? response : '' }
 
           { examUpdated===true ? 
              
                  <Link to={`/fill_mcq_questions?name=${name}&room=${room}&_id=${_id}`}>
                 
                        <button className="SEfinal" style={{padding:'15px'}}>Fill Questions </button>
                  </Link>
           : null } 
        </div>
       <div style={{height:'12vh'}}></div>
</div>
</div>
    )
}

export default Mcq_form
