const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({  
     name:{
         type:String,
         required:true
     },
     scholarId:{
         type:Number,
         required:true
     },
     email:{
      type: String,
      required: true,
      trim: true
     },
     date:{
      type:String,
      required:true
     },
    marks:{
      type:Number,
      required:true,
      default:0
     },
    fillUp:[{
      questionNo:{
        type:Number
        //required:true
      },
      studentResponse:{
        type:String
        //required:true
      }
    }],
    mcq:[{
      questionNo:{
        type:Number
        //required:true
      },
      studentResponse:{
        type:String
        //required:true
      }
    }],
    examObjOwner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'ObjectiveExam'
    }
})

const StudentObj = mongoose.model('StudentObj', studentSchema);

module.exports = StudentObj;
