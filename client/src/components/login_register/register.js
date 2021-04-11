import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/authContexts/authContext';
import '../../css/register.css';

import src from './images/logo.png';

const Register = (props) => {
  const {
    registerTeacher,
    //confirmMail,
    userAuth,
    errors,
    setError,
    clearError
  } = useContext(AuthContext);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const fetchData = async ()=>{
      if(userAuth){
        props.history.push('/');
      }
    }
    fetchData();
  }, [userAuth , props.history])

  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    password: '',
    password_repeat: '',
    phoneNumber: '',
    institute: ''
  });

  const {
    name,
    email,
    password,
    password_repeat,
    phoneNumber,
    institute
  } = teacher;

  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value
    });
    console.log(e.target);
    clearError();
  };

  const submit = async (e)=>{
    e.preventDefault();
    if(password !== password_repeat){
      await setError("Password don't match");
      setHide(false);
    }else{
      await registerTeacher({name,email,password,phoneNumber,institute});
      setHide(false);
    }
  }

  const hideDisplay = (e) => {
    setHide(true);
  };

  return (
    
    <div className="reg">
    <div className="wrapper">
    <section className="left">
      <img className="logo" src={src} alt="" />
      <div className="question">

          Already Registered?
      
      </div>
      <div className="btn111 noHover">
        <button className="join noHover" type="submit">
           <Link to="/login" style={{color:"white",textDecoration:'none'}}>Sign In</Link>
        </button>
        <p className="" style={{marginTop:'50px'}}><Link to="/studentLogin" style={{color:"white",textDecoration:'none',fontSize:'150%',fontWeight:'bold'}}>Are you as student ?</Link>.</p>
      </div>
    </section>
    <section className="right">
      <div>
        <h2 className="signIn">Sign Up</h2>
      </div>
      <form action="post" onSubmit={submit}>
        <div className="input-box">
          <input className="name" 
            type="text" 
            placeholder="Name" 
            required 
            name='name'
            onChange={handleChange}
            value={name} />
        </div>
        <div>
          <input className="email"
             type="email" 
             placeholder="Email"
             required
             name='email'
             onChange={handleChange}
             value={email}/>
        </div>
        <div>
          <input
            className="phnNo"
            type="tel"
            placeholder="Mobile Number"
            required
            name='phoneNumber'
            onChange={handleChange} 
            value={phoneNumber}
          />
        </div>
        <div>
          <input
            className="pass"
            type="password"
            placeholder="Password"
            required
            name='password'
            onChange={handleChange} 
            value={password}
          />
        </div>
        <div className="input-box">
          <input className="name" 
            type="password" 
            placeholder="Repeat Password" 
            name="password_repeat" 
            required 
            onChange={handleChange} 
            value={password_repeat}/>   
        </div>
        <div className="input-box">
           <input className="name" 
            type="text" 
            placeholder="Currently Working institution"
            name="institute" 
            required 
            autoComplete="off"
            onChange={handleChange} 
            value={institute}/>
        </div>
        <div>
          <button className="btnSignIn" type="submit">
            Sign Up
          </button>
          { hide===false && errors !== null && <div style={{height:'30px',width:'20%',position:'absolute',fontSize:'2rem',color:'red',marginLeft:'15%',marginTop:'70px'}}>
          {errors.msg ? errors.msg : errors.error[0].msg }
          
          </div>} 
        </div>
      </form>
    </section>
  </div>
  </div>
      
    );
};

export default Register;