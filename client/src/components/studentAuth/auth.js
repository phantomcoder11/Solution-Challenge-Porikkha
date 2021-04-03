import React,{ useState, useEffect } from 'react'
import GoogleLogin from 'react-google-login';
import axios from 'axios';

import { Link } from 'react-router-dom';

import Navbar from '../navbar/Navbar';

import '../../css/Button.css'

const Auth = () => {
  
    const [ emailVerified , setEmailVerified ] = useState(false);
    
    const [ error , setError ] = useState(false);

    const [ name , setName ] = useState('');

    const [ email , setEmail ] = useState('');

    const [ clicked , setClicked ] = useState(false);

    const responseSuccessGoogle = async (res) => {
    console.log(res);
    
    const data = { tokenId: res.tokenId };
    
    const response = await axios.post(
      'http://porikkha.centralus.cloudapp.azure.com/student/login',
      data
      );
      
      console.log(response);
      
      const { email_verified } = response.data;
      
    if (email_verified) {
      setEmailVerified(true);

      const { name, email } = response.data;

      setName(name);

      setEmail(email);

      setClicked(true);
    }
  };
  
  const responseErrorGoogle = (res)=>{
     
    console.log(res);

   console.log(res.profileObj);

   console.log(res.tokenId);

   setError(true);

   setClicked(true);
  }
  
  const studentAuthStyle = {
    height:'80vh',
    width:'100vw',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    overflowX:'hidden'
  }
  
  const boxStyle = {
    height:'30vh',
    width:'30vw',
    border:'2px solid black',
    textAlign:'center',
    fontSize:'10vw'
  }
  
  return (
    <div>
      <Navbar />

      <div style={studentAuthStyle}>
        <div style={boxStyle}>
          <h1 style={{ marginLeft: '-115vw' }}>Login with Google</h1>

          <div style={{ marginTop: '-10vh' }}>
            <GoogleLogin
              clientId='754763699582-2gkh2m088eh6srrrtfckakdne5ahcbbh.apps.googleusercontent.comS'
              buttonText='Login with google'
              onSuccess={responseSuccessGoogle}
              onFailure={responseErrorGoogle}
              cookiePolicy={'single_host_origin'}
              />
          </div>
        </div>

        <div style={{ position: 'absolute', marginTop: '60vh' }}>
          {clicked === false ? null : error === true ? (
            <Link to='/login'>
              <button className='buttonStyle'>
                Failed Authentication.Click Return to login again
              </button>
            </Link>
          ) : emailVerified === false ? (
            <Link to='/login'>
              <button className='buttonStyle'>
                Failed Authentication.Click to Return to login again
              </button>
            </Link>
          ) : (
            <Link to={`/student?name=${name}&email=${email}`}>
              <button className='buttonStyle'>
                You are authenticated. Click here to Enter to your Examination
                Portal
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;