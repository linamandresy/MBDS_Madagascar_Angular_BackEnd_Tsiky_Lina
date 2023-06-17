var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

let User = require('../model/user');

function register(req,res){
    var hashedPassword = bcrypt.hashSync(req.body.password,8);

    let user = new User();
    user.id = req.body.id;
    user.userName = req.body.username;
    user.password = hashedPassword;

    user.save((err)=>{
        if(err){
            return res.status(500).send("Cannot register user");
        }
        var token = jwt.sign({id:user._id},config.secret,{expiresIn:86400});
        res.status(200).send({auth:true,token:token});
    });
}

function me(req,res){
    var token = req.headers['x-access-token'];
    if(!token) res.status(401).send({auth:false,message:'No token provided'});

    jwt.verify(token,config.secret,function (err,decoded){
        if(err) return res.status(401).send({auth:false,message:'Failed to authenticate token'});
        res.status(200).send(decoded);
    });
}


function checkConnection(req,res){
    var token = req.headers['x-access-token'];
    if(!token) res.status(401).send({auth:false,message:'No token provided'});

    jwt.verify(token,config.secret,function (err,decoded){
        if(err) return res.status(401).send({auth:false,message:'Failed to authenticate token'});
    });
}

module.exports ={ register , me , checkConnection };