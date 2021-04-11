const express = require('express');

const router = new express.Router();

const FillUp = require('../models/FillUp');

const mongoose = require('mongoose');

//   AddFillUps
router.post('/add/:_id',async (req,res)=>{
    console.log(req.body);

    try {
        const fillUp = new FillUp({
            questionNo:req.body.questionNo,
            question:req.body.question,
            correct_answer:req.body.correct_answer,
            marks:req.body.marks,
            examObjOwner:mongoose.Types.ObjectId(req.params._id)
        });

        await fillUp.save();
        
        res.status(201).json(fillUp);

    } catch (error) {
        
        console.log(error);
        
        res.status(500).json({error : 'Server Error' });
    }
})

//   Edit_Fill_Up_Details 
router.patch('/edit/:_id',async (req,res)=>{
    
    console.log(req.body);

    try {
        const updates=Object.keys(req.body);
        
        const _id = req.params._id;
        
        const fillUp = await FillUp.findById(_id);
    
        if(!fillUp){
            res.json({msg:"Invalid Id"});
        }
        updates.forEach((update)=>fillUp[update]=req.body[update]);
      
        await fillUp.save();
      
        res.status(200).json(fillUp);   
      
    } catch (error) {
    
        res.json({msg:'Server Error'});
    }
})

module.exports = router;