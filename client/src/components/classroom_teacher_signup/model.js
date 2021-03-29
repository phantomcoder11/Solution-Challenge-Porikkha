import React,{ useState, useContext,useEffect } from 'react';
import classRoomContext from '../../context/classContexts/classContext';

const Model = ({open,isClose,children}) => {

    const {add_classroom , editDetails ,updateDetails } = useContext( classRoomContext );
    
    const MODEL_STYLES={
       position: 'fixed',
       top: '50%',
       left: '50%',
       transform: 'translate(-50%, -50%)',
       backgroundColor: 'white',
       borderRadius:'1rem',
       padding: '10px',
       zIndex: 1000,
       width:'30%',
       textAlign :'center',
       height:'50vh'
    }
    const OVERLAY_STYLES={
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(70, 70, 70, 49%)',
       
      
        zIndex: 1000
    }
    const INPUT_STYLES={
        border:'3px solid white'
        ,width:'200%',
        height:'25%',
        padding:'10%',
        fontSize:'large',
        marginLeft:'-50%',
        color:'white',
        background: 'transparent',
        borderRadius:'20px'
    };
    const FORM_STYLES={backgroundColor:'#1DA6CF', height:'68.7%',borderRadius:'10px',marginTop:'2%'};
    const BUTTON_STYLES={border:'1px solid white',borderRadius:'1em',fontSize:'130%',padding:'6% 0% 6% 0%',margin:'0 3% -5% 3%',cursor:'pointer',color:'white',backgroundColor:'blue'};

    const [classroom,setClassroom]=useState({
        name:'',
        strength:''
    });
    const [perform,setPerform]=useState('Create');
    useEffect(() => {
        const changeDetails=(name,number)=>{
            setClassroom({
                name:name,
                strength:number
            })
         }
        if(editDetails!==null && open===true){
          changeDetails(editDetails.name, editDetails.strength);
          setPerform('Edit');
        }
        else{
          changeDetails('','');
          setPerform('Create');
        }
    }, [open])

    const { name, strength } = classroom ;

    const onChange=(e)=>{
        setClassroom({
            ...classroom,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit= async (e)=>{
        e.preventDefault();
        classroom.strength=parseInt(classroom.strength);
        if(editDetails!==null){
            await updateDetails(editDetails._id,classroom);
        }else{
            await add_classroom(classroom);
        }
        setClassroom({
            name:'',
            strength:'',
        })
        isClose();
    }
    return (
        open!==true?null:
        <div >
            <div style={OVERLAY_STYLES} />
            <div style={MODEL_STYLES}>
              <button onClick={isClose} style={{marginLeft:"80%",marginTop:"0vh"}}>&#10060;</button><br/><br/>
            <span style={{fontSize:"160%",marginTop:"0",color:'#0078A6'}}>ADD NEW CLASS :</span>
               <br/><br/>
               <span style={{border:'1px solid blue',padding:'2px'}}>
                   {children}
                </span>
              <form className="probinfo" style={FORM_STYLES} onSubmit={onSubmit}>
                 <input className="username" style={INPUT_STYLES} type="text" name="name" value={name}  onChange={onChange} placeholder="Classroom Name"  required autoComplete="off" /><br/>
                 <input className="username" style={INPUT_STYLES} type="number" name="strength" value={strength} onChange={onChange} placeholder="Class Strength"  required autoComplete="off" /><br/>
                 <input type="submit" value={perform} className="button" style={BUTTON_STYLES} />
              </form>
            </div>
        </div>
    )
}

export default Model;