const express = require("express");
const router = new express.Router();

const mongoose = require('mongoose');

const StudentObj = require('../models/studentObj');


//Register students
router.post('/' , async (req,res)=>{
  
    const student = new StudentObj({
        name : req.body.name,
        scholarId:req.body.scholarId,
        email:req.body.email,
        date:new Date().toISOString(),
        examObjOwner:mongoose.Types.ObjectId(req.body._id)
    });

    student['mcq']=[];

    for(let i = 0 ; i < req.body.mcqs_length ; i++ ){
      
        student['mcq'] = student['mcq'].concat({
          questionNo: i+1 ,
          studentResponse:-1
        })
    }

    student['fillUp']=[];

    for(let i = 0 ; i < req.body.fill_ups_length ; i++ ){
      
      student['fillUp'] = student['fillUp'].concat({
        questionNo: i+1 ,
        studentResponse:'-1'
      })
    }
    
    await student.save();
        
    res.status(201).json({student:student._id});
 
    },( error,req,res,next )=>{
      return  res.json({ error: error.message});
    }
)

router.get('/:_id', async (req,res)=>{
  
  try {
    
    const response = await StudentObj.findById(req.params._id);

    if(response===null){
      throw new Error('Unable to fetch request');
    }

    res.status(200).json({student:response});
 
  } catch (error) {

    res.json({error:'Internal Server Error'});

  }
})

router.patch('/mcq/:_id' , async (req,res)=>{
  
  try {
    const updates=Object.keys(req.body);
    const allowedUpdates=[ 'mcq' , 'fillUp' ];
    const isValid=updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        res.json({error:"Invalid Updates"});   
    }
    const _id=req.params._id;
    
    const student = await StudentObj.findById(_id);
    
    if(!student){
        res.json({ student : null ,error:"Invalid Id"});
    }

    student['mcq']=[];

    req.body['mcq'].forEach(q => {
      student['mcq'] = student['mcq'].concat(q)
    });
        
    await student.save();
    
    res.status(200).json({ student : student , error : null });   
  } catch (error) {
    
    res.status(500).json({ student:null , error:'Server Error'});
  }
 }
)

router.patch('/fillUp/:_id' , async (req,res)=>{
  
  try {
    const updates=Object.keys(req.body);
    const allowedUpdates=[ 'mcq' , 'fillUp' ];
    const isValid=updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        res.json({error:"Invalid Updates"});   
    }
    const _id=req.params._id;
    
    const student = await StudentObj.findById(_id);
    
    if(!student){
        res.json({ student : null ,error:"Invalid Id"});
    }

    student['fillUp']=[];

    req.body['fillUp'].forEach(q => {
      student['fillUp'] = student['fillUp'].concat(q)
    });
        
    await student.save();
    
    res.status(200).json({ student : student , error : null });   
  } catch (error) {
    
    res.status(500).json({ student:null , error:'Server Error'});
  }
 }
)

router.patch('/marks/:_id' , async (req,res)=>{
  
  try {
    const updates=Object.keys(req.body);
    const allowedUpdates=[ 'marks'];
    const isValid=updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        res.json({error:"Invalid Updates"});   
    }
    const _id = req.params._id;
    
    const student = await StudentObj.findById(_id);
    
    if(!student){
        res.json({ student : null ,error:"Invalid Id"});
    }
    
    await updates.forEach((update)=>student[update]=req.body[update]);
        
    await student.save();
    
    res.status(200).json({ student : student , error : null });   
  } catch (error) {
    
    res.status(500).json({ student:null , error:'Server Error'});
  }
 }
)

module.exports = router;