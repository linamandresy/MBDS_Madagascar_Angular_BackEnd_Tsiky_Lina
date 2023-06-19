"use strict";
const express = require("express");
const router = express.Router();
const Matiere = require('../model/matiere');

router.post('/',async (req,res,next)=>{
   let matiere = new Matiere();
   matiere.id = req.body.id;
   matiere.name = req.body.name; 
   matiere.matierePicture = req.body.matierePicture;
   matiere.profPicture = req.body.profPicture; 

   console.log("Post Matiere recu");
   matiere.save((err)=>{
    if(err){
        res.status(500).send('cannot post matiere',err);
    }
    res.status(200).json({message:`Matiere ${matiere.name} créé`});
   });
});

router.get('/',(req,res,next)=>{
    let aggregateQuery = Matiere.aggregate();

    Matiere.aggregatePaginate(aggregateQuery,{
        page:parseInt(req.query.page)||1,
        limit: parseInt(req.query.limit)||10
    },(err,matiere)=>{
        console.log(err);
        if(err){
           return  res.status(500).send(err);
        }
        res.status(200).send(matiere);
    });
});


module.exports = router;