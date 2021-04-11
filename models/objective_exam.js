const mongoose = require("mongoose");

const objectiveExamSchema = new mongoose.Schema({
    name:{
       type:String,
       required:true
    },
    timeLength:{
       type:String,
       trim:true,
       required:true
    },
    date:{
        type:String,
        required:true
    },
    navigationStatus:{
       type:String
    },
    mcqType:{
       type:String
    },
    startTime:{
       type:Number,
       required:true
    },
    classroomOwner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Classroom'
    }
})

//ObjectiveExam -> Student
objectiveExamSchema.virtual('student_obj',{
    ref:'StudentObj',
    localField:'_id',
    foreignField:'examObjOwner'
 })

//ObjectiveExam -> MCQ
objectiveExamSchema.virtual('mcq_Obj',{
    ref:'MCQ',
    localField:'_id',
    foreignField:'examObjOwner'
 })

//ObjectiveExam -> Fill Up
objectiveExamSchema.virtual('fill_up_obj',{
    ref:'FillUp',
    localField:'_id',
    foreignField:'examObjOwner'
 })

 const ObjectiveExam = mongoose.model('ObjectiveExam',objectiveExamSchema);

module.exports = ObjectiveExam;