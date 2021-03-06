const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
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
    startTime:{
        type:Number,
        required:true
     },
    questionPaperType:{
        type:String,
        required:true
    },
    questionPaper:{
        type:Buffer
    },
    classroomOwner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Classroom'
    }
})
//Exam -> Student
examSchema.virtual('students',{
    ref:'Student',
    localField:'_id',
    foreignField:'owner'
 })

const Exam = mongoose.model('Exam',examSchema);

module.exports = Exam;