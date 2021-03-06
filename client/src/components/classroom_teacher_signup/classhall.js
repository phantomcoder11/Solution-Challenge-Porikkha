import React,{useState, useContext,useEffect} from 'react'
// import '../../App.css';
import '../../css/classhall.css';
import plus from "../../img/plus.png";
import Model from './model';
import ClassRoom from './classRoom';
import ClassContext from '../../context/classContexts/classContext';
import ClassroomSearch from './classroomSearch';

import authContext from '../../context/authContexts/authContext';
import Loader from './Loader';

import NoResults from './Noresults';

const Classhall = () => {

    const {classRooms,search,isOpen,changeIsOpen ,clearEditDetails , getClassroom } = useContext(ClassContext);

    const { log_out , clearError, teacher , getTeacher } = useContext(authContext);

    const [ teacherState , setTeacherState ] = useState(null);

    const [classes , setClasses]=useState(null);

    useEffect(()=>{
        const fetchData = async ()=>{
            if(teacherState===null){
              await getTeacher();
              await setTeacherState(teacher);
            }
         }
         fetchData();
    },[teacher]);

    useEffect(()=>{
        const fetchDataC = async ()=>{
            await  getClassroom();
            await  setClasses(classRooms);
        }
        fetchDataC();
    },[classRooms])

    const handleChange=()=>{
        changeIsOpen();
        clearEditDetails();
    }

    const logout=()=>{
        log_out();
        clearError();
    }

    const buttonStyles={position:'absolute',margin:"1% 80%",zIndex:'10000',borderRadius:'5px',cursor:'pointer'}
    return (
        <div className="classHall">
             <div className="topnav" id="myTopnav">
                <a  className="active">Porikkha</a>
                <ClassroomSearch/>
                <div className="class_home_nav_button">

                    <div className="plus">
                        <span>Create New Classroom</span>
                        <button onClick={handleChange}>
                        <img id="p_button" src={plus} /></button>
                    </div>
                    <button className="CHlogout"   onClick={logout}>Log Out</button>
                </div>
            
             </div>
             
             <Model open={isOpen} isClose={handleChange}>
                   {teacherState!==null ? teacherState.name : null}               
                </Model>
             <div className="exams">
                 { search===null && classes===null ?  <Loader /> : 
                    search !== null ? search.length===0 ? 
                    <NoResults /> : 
                    search.map((classRoom)=><ClassRoom key={classRoom._id} classRoom={classRoom}/>) : 
                    classes.length===0 ? <NoResults />  :
                    classes.map((classRoom)=><ClassRoom key={classRoom._id} classRoom={classRoom}/>) 
                 }
             </div>
        </div>
    )
}

export default Classhall