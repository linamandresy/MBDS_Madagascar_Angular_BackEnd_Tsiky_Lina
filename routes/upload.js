"use strict";
const express = require("express");
const router = express.Router();
const fireBaseUpload = require("../helper/FireBaseStorage");

router.post('/',async (req,res,next)=>{
	let url = await fireBaseUpload(req.files.image.data,req.files.image.name,req.files.image.mimetype);
	res.send({
		ok:true,
		url:url
	});
});


module.exports=router;