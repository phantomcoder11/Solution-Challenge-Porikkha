const express = require("express");
const router = new express.Router();

const multer = require("multer");
const exceljs = require('exceljs');
const Exam = require('../models/exam');

const mongoose = require('mongoose');

const upload = multer({
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|PNG|JPG|JPEG)$/)) {
        return cb(new Error("Please provide an image or a pdf!"));
      }
      cb(undefined, true);
    }
});

router.post('/uploadQuestionPaper', upload.single('upload_question_paper')  , async (req,res)=>{
    
  const response = await Exam.findOne({ name : req.body.name });

  if(response!==null){
    return res.json({ error:'Please Enter Unique Name to your exam'});
  }
  
  const timeL = req.body.hour + ':' + req.body.minute;

    const exam = new Exam({
        name : req.body.name,
        timeLength:timeL,
        date:new Date().toISOString(),
        startTime:new Date().getTime(),
        questionPaperType:req.file.mimetype,
        questionPaper:req.file.buffer,
        classroomOwner:mongoose.Types.ObjectId(req.body._id)
   });
    console.log(exam);
    await exam.save();
        
    res.status(201).json({exam:exam});
 
    },( error,req,res,next )=>{
      console.log(error);
      return  res.json({ error: error.message});
    }
)

router.get('/getExamByRoom/:room', async (req,res)=>{
  
  try {
    
    const response = await Exam.findOne({ name : req.params.room });

    console.log(response); 

    if(response===null){
      return res.json({error: 'No exam exists with that room-name'});
    }
    res.status(200).json({_id:response._id});
 
  } catch (error) {

    console.log(error);
    
    res.json({error:'Internal Server Error'});

  }
})

router.get('/getExamDetails/:_id',async (req,res)=>{
   
   try {

      const response = await Exam.findById(req.params._id); 
      
      if(response===null){
         return res.json({ error : 'Unable to fetch request' });
      }
      
      await response.populate('students').execPopulate();

      console.log('Exams',response);

      res.status(200).json({exam:response,students:response.students});

    } catch (error) {
      res.json({error:'Internal Server Error'});
   }
})

router.get('/getQuestionPaper/:_id', async (req,res)=>{
  
  try {
    
    const response = await Exam.findById(req.params._id);

    if(response===null){
      throw new Error('Unable to fetch request');
    }

    res.set('Content-Type','multipart/form-data');

    console.log(response);

    res.status(200).send({exam:response});
 
  } catch (error) {

    console.log(error);
    
    res.json({error:'Internal Server Error'});

  }
})

router.get('/getStudentsExcel/:_id',async (req,res)=>{
   
  try {

     const response = await Exam.findById(req.params._id); 
     
     if(response===null){
        return res.json({ error : 'Unable to fetch request' });
     }
     
     await response.populate('students').execPopulate();

     const workbook = new exceljs.Workbook();

     const worksheet = workbook.addWorksheet('Students');

     worksheet.columns = [
       // name scholarId email status marks
        { header:'name' , key:'name' , width:10 },
        { header:'scholarId' , key:'scholarId' , width:10 },
        { header:'email' , key:'email' , width:10 },
        { header:'status' , key:'status' , width:10 },
        { header:'marks' , key:'marks' , width:10 }
     ]

     await response.students.forEach(student => {
          worksheet.addRow({
            name : student.name ,
            scholarId : student.scholarId ,
            email : student.email ,
            status : student.status ,
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

module.exports = router;