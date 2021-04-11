import React,{ useState,useContext , useEffect } from 'react';
import { Link } from "react-router-dom";
import AuthContext from '../../context/authContexts/authContext';
import '../../css/register.css';

import src from './images/logo.png';

const Login=(props)=>{

  const { loginTeacher , userAuth , errors , clearError } = useContext(AuthContext)

  const [ teacherl , setTeacherl ] = useState({
    email:'',password:''
  });

  useEffect(() => {
    const fetchData = async ()=>{
      if(userAuth){
        props.history.push('/');
      }
    }
    fetchData();
  }, [userAuth , props.history])

  const {email,password} = teacherl;

  const handleChange = (e)=>{
     setTeacherl({
       ...teacherl,
       [e.target.name]:e.target.value
     })
     clearError();
  }
  
  const logSubmit = (e)=>{
    e.preventDefault();
    loginTeacher({email,password});
  }
  return (
    <div className="reg">
    <div className="wrapper">
    <section className="left">
      <img className="logo" src={src} alt="" />
      <div className="question">

          New User?
      
      </div>
      <div className="btn111">
          <Link to="/register" style={{color:"white",textDecoration:'none'}}>
             <button className="join" type="submit">
                 Sign Up
             </button>
          </Link>
          <p className="" style={{marginTop:'50px'}}><Link to="/studentLogin" style={{color:"white",textDecoration:'none',fontSize:'150%',fontWeight:'bold'}}>Are you as student ?</Link>.</p>

      </div>
    </section>
    <section className="right" style={{marginTop:'150px'}}>
      <div>
        <h2 className="signIn">Sign In</h2>
      </div>
      <form action="post" onSubmit={logSubmit}>

        <div>
          <input className="email" 
             type="email" 
             placeholder="Email"
             required 
             name='email'
             autoComplete="off"
             onChange={handleChange}
             value={email}/>
        </div>
    
        <div>
          <input
            className="pass"
            type="password"
            placeholder="Password"
            required
            name='password'
            autoComplete="off"
            onChange={handleChange} 
            value={password}
          />
        </div>
       
    
        <div>
          <button className="btnSignIn" type="submit">
            Sign In
          </button>
             {errors !== null && <div style={{height:'30px',width:'20%',position:'absolute',fontSize:'2rem',color:'red',marginLeft:'15%',marginTop:'70px'}}>
             {errors.msg ? errors.msg : errors.error[0].msg }
             
            </div>} 
        </div>
      </form>
    </section>
  </div>
  </div>
  )
}

export default Login;