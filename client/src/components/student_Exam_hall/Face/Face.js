import React, {useRef,useEffect, useState,useContext} from 'react';
// import Face from "./components/Face";
import {drawMesh} from "./utilities";

import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import "./Face.css";
import WebCamContext from "../../../context/webcamContext/webcamContext";

var count =0;
var warning_num =5;
// var stable = 0;
var xyz;
var warn="good";
let check;
function Face() {


const {CheckWebCam}=useContext(WebCamContext);

const webcamRef = useRef(null);
const canvasRef = useRef(null);

const [checkThis,setCheckThis]=useState();
const [checkIt,setCheckIt]=useState();



useEffect(async ()=>{

  setCheckThis( webcamRef.current.state.hasUserMedia);
  check=checkThis;
console.log(webcamRef);
  // CheckWebCam(checkThis);
  // check=await webcamRef.current.state.hasUserMedia;
  // console.log(webcamRef.current.state.hasUserMedia);
  // if(!check){
  //   alert("Allow your webcam or else you will be unable to give your exam");       
  // }
  // setInterval(()=>{
  //   navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
  //     navigator.webkitGetUserMedia ||
  //     navigator.mozGetUserMedia ||
  //     navigator.msGetUserMedia);

  // navigator.getMedia({video: true}, function() {
  //   console.log("on");
  //   setCheckIt(true)
  // }, function() {
  //   setCheckIt(false)
  //     console.log("off");
  // });
  // },2000)
  
 
},[checkThis,checkIt,webcamRef])


const runFacemesh = async()=>{
  const net = await facemesh.load({
    inputResolution:{width:500,height:480},scale:0.8 
  });
  
  setInterval(()=>{
  
    navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
  
  navigator.getMedia({video: true}, function() {
    detect(net)  
    
  }, function() {
    
      console.log("off");
  });

    
    
  },1000)

};

const CheckWebCams=()=>{
  navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

navigator.getMedia({video: true}, function() {
  console.log("on");
  setCheckIt(true)
  runFacemesh();
  CheckWebCam(true)
}, function() {
  setCheckIt(false)
  runFacemesh();
  CheckWebCam(false)
    console.log("off");
});
}

setInterval(()=>{
  
  CheckWebCams();
},10000)



const detect = async(net)=>{
  
  if(
    typeof webcamRef.current!=="undefined" && 
    webcamRef.current !==null && 
    webcamRef.current.video.readyState === 4)
    {
      // setCheck(true)
      // navigator.mediaDevices.getUserMedia({video:true,audio:true},(stream)=>{
      //   console.log(stream);
      //   if(!stream.getVideoTracks().length>0){
          
      //   }
      // })
    //  const video = webcamRef.current.video;
    //  const videoWidth = webcamRef.current.video.videoWidth;
    //  const videoHeight = webcamRef.current.video.videoHeight;

    //  webcamRef.current.video.width = videoWidth;
    //  webcamRef.current.video.height = videoHeight;

    //  canvasRef.current.width = videoWidth;
    //  canvasRef.current.height = videoHeight;
    const video = webcamRef.current.video;

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // console.log();
    // Set video width
    // webcamRef.current.video.width = videoWidth;
    // webcamRef.current.video.height = videoHeight;


    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
     const face = await net.estimateFaces(video);
     
  //    if(face.length === 0){
       
  //     //  document.querySelector(".popup_setup").style.display="block";
  //     // alert("No face detected")
  // // alert("no face detected")
  //     count++;
      
  //    }
     
     if(face.length === 0){
     warning_num--;

      alert(warning_num + " more times and you will be disqualified");
      count=0;
     }
     if(warning_num<1){
         alert("You are disquilified");
     }
    // if(xyz===face){
    //   // stable++;
    //   xyz =face;
    // }

   
    
     if(face.length !== 0){
      //  console.log(xyz);
      }
    if(face.length >1){
      alert("more than 1 face detected");
    }
     //drawing
    const ctx = canvasRef.current.getContext("2d");
    drawMesh(face,ctx);
  }

}


  return (
    <div className="App">
    <div className="model_pop">
      <div>
          {/* UNable */}
      </div>
    </div>
    <Webcam ref={webcamRef} style={
      {
        // position:"absolute",
        marginLeft:"auto",
        marginRight:"auto",
        textAlign:"center",
        top:"200px",
        left:"0px",
        right:"0px",
        zIndex:10,
        width:500,
        height:390,
        borderRadius:"0%",
        

      }
    }/>
  <canvas ref={canvasRef} style={
      {
        position:"absolute",
        marginLeft:"auto",
        marginRight:"1%",
        textAlign:"center",
        top:"440px",
        left:"0px",
        right:"30px",
        zIndex:10,
        width:500,
        height:390
        
      }
    }/>
   
   </div>
  );
}

export {check};
export default Face