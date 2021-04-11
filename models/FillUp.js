const mongoose = require('mongoose');

const FillUpSchema = new mongoose.Schema({
    questionNo:{
        type:Number,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    correct_answer:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        required:true,
        default:0
    },
    examObjOwner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'ObjectiveExam'
    }
})

const FillUp = mongoose.model('FillUp',FillUpSchema);

module.exports = FillUp;

//           questionNo:1,
//           question:'',
//           noOfOptions:0,
//           options:[{
//              optionNo:1,
//              option:''
//           }],
//           correct_answer:'',
//           student_response:'',
//           marks:''
// questionNo:1,
// question:'',
// correct_answer:'',
// student_response:'',
// marks:''
