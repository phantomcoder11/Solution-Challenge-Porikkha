const express = require("express");
const router = new express.Router();

const mongoose = require('mongoose');

const Objective_exam =require("../models/objective_exam");

const authentication = require("../utils/authentication");

const exceljs = require('exceljs');

const fs = require('fs').promises;

// Get Objective Paper ID for a name
router.get('/getExamByName/:room', async (req,res)=>{
  
  try {
    
    const response = await Objective_exam.findOne({ name : req.params.room });

    console.log(response); 

    if(response===null){
      return res.json({error: 'No exam exists with that room-name'});
    }

    await response.populate('fill_up_obj').execPopulate();

    await response.populate('mcq_Obj').execPopulate();

    console.log('Exams',response);

    res.status(200).json({ _id:response._id , mcqs_length:response.mcq_Obj.length , fill_ups_length:response.fill_up_obj.length });
 
  } catch (error) {

    console.log(error);
    
    res.json({error:'Internal Server Error'});

  }
})

// Get Objective Paper Detailed MCQs and Fill Ups for a given Id

router.get('/getExamById/:_id',async (req,res)=>{
   
  try {

     const response = await Objective_exam.findById(req.params._id); 
     
     if(response===null){
        return res.json({ error : 'Unable to fetch request' });
     }
     
     await response.populate('fill_up_obj').execPopulate();

     await response.populate('mcq_Obj').execPopulate();

     console.log('Exams',response);

     res.status(200).json({ exam:response , mcqs:response.mcq_Obj , fill_ups:response.fill_up_obj });

   } catch (error) {
     res.json({error:'Internal Server Error'});
  }
})

// get students of that exam
router.get('/getExamDetails/:_id',async (req,res)=>{
   
  try {

     const response = await Objective_exam.findById(req.params._id); 
     
     if(response===null){
        return res.json({ error : 'Unable to fetch request' });
     }
     
     await response.populate('student_obj').execPopulate();

     console.log(response.student_obj);

     res.status(200).json({ exam:response , students:response.student_obj });

   } catch (error) {
     res.json({error:'Internal Server Error'});
  }
})

//create Objective Paper

router.post("/",authentication,
   async (req,res)=>{
   
     const response = await Objective_exam.findOne({ name : req.body.name });

    if(response!==null){
      return res.json({ error:'Please Enter Unique Name to your exam'});
    }

    try {

        const timeL = req.body.hour + ':' + req.body.minute;
   
        const objective_Exam = new Objective_exam({
                name : req.body.name,
                timeLength:timeL,
                date:new Date().toISOString(),
                startTime:new Date().getTime(),
                classroomOwner:mongoose.Types.ObjectId(req.body._id)
        });
   
        await objective_Exam.save();
        res.status(201).json(objective_Exam);
   
   } catch (error) {
    
    console.log(error);
     res.status(500).json({error : 'Server Error' });
   }
})

//update Objective Paper

router.patch("/:_id",authentication,
   async (req,res)=>{
   
    console.log(req.params._id);

    try {

         const updates=Object.keys(req.body);
        
        const _id = req.params._id;
        
        const objective_exam = await Objective_exam.findById(_id);
    
        if(!objective_exam){
            res.json({msg:"Invalid Id"});
        }
        updates.forEach((update)=>objective_exam[update]=req.body[update]);
      
        await objective_exam.save();
      
        res.status(200).json(objective_exam);     
      
    } catch (error) {
    
        res.json({msg:'Server Error'});
    }
})

router.get('/getStudentsExcel/:_id',async (req,res)=>{
   
  try {

     const response = await Objective_exam.findById(req.params._id); 
     
     if(response===null){
        return res.json({ error : 'Unable to fetch request' });
     }
     
     await response.populate('student_obj').execPopulate();

     const workbook = new exceljs.Workbook();

     const worksheet = workbook.addWorksheet('Students');

     worksheet.columns = [
       // name scholarId email status marks
        { header:'name' , key:'name' , width:10 },
        { header:'scholarId' , key:'scholarId' , width:10 },
        { header:'email' , key:'email' , width:10 },
        { header:'marks' , key:'marks' , width:10 }
     ]

     await response.student_obj.forEach(student => {
          worksheet.addRow({
            name : student.name ,
            scholarId : student.scholarId ,
            email : student.email ,
            marks : student.marks
          })
     });

     worksheet.getRow(1).eachCell((cell)=>{
        cell.font = { bold : true }
     })

     await workbook.xlsx.writeFile(`./uploads/students.xlsx`);

     const fileLocation = `./uploads/students.xlsx`;

     const file = 'students.xlsx' ;
     
     res.download( fileLocation , file , async (error)=>{
        
          console.log("Error : ", error);

          await fs.unlink(`./uploads/students.xlsx`);
     });

   } catch (error) {
     res.status(500).json(error);
  }
})

module.exports=router;