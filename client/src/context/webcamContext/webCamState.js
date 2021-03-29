import React,{useReducer} from 'react';
import WebcamReducer from './webcamReducer';
import WebcamContext from './webcamContext';
import axios from 'axios';
import { CHECK_WEB } from '../types';

const WebCamState=(props)=>{
   const initialState={
        check_web_cam:false
   }

const [state, dispatch] = useReducer(WebcamReducer, initialState);

   
const CheckWebCam=(webcam)=>{
    dispatch({
        type:CHECK_WEB,
        payload:webcam
    })
}

   return(
      <WebcamContext.Provider
      value={{
        
          CheckWebCam,
          check_web_cam:state.check_web_cam
      }} 
      >{props.children}</WebcamContext.Provider>
   )
}
export default WebCamState;
