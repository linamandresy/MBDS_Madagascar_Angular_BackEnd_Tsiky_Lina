var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

let User = require('../model/user');
const { ObjectId } = require('mongodb');

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
        let token = jwt.sign({id:user._id},config.secret,{expiresIn:86400});
        res.status(200).send({auth:true,token:token,isAdmin:false});
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
    return new Promise((resolve,reject)=>{
        var token = req.headers['x-access-token'];
        if(!token)  reject(res.status(401).send({auth:false,message:'No token provided'}));
    
        jwt.verify(token,config.secret,function (err,decoded){
            if(err) reject(res.status(401).send({auth:false,message:'Failed to authenticate token'}));
            User.findOne({_id:ObjectId(decoded.id)} ,(err,user)=>{
                if(err || user==null) resolve(res.status(401).send("Not connected"));
                let isAdmin = user.userName==='admin'
                resolve(isAdmin);
            });
        });
    });
}

function login(req,res){
    
    User.findOne({userName:req.body.username} ,(err,user)=>{
        if(err || user==null) return res.status(401).send("Wrong username ");
        console.log(user);
        let isAdmin = user.userName==='admin';
        let passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
        if(!passwordIsValid) return res.status(401).send("Wrong password");
        let token = jwt.sign({id:user._id},config.secret,{expiresIn:86400});
        res.status(200).send({auth:true,token:token,isAdmin:isAdmin});
    });
}
module.exports ={ register , me , checkConnection , login };