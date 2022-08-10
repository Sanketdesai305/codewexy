import express from 'express';
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config();
var router = express.Router();
router.use(bodyParser.json());
router.post('/new', async(req,res)=>{
       //check if user exists
       const username = await User.findOne({username:req.body.username})
       if(username){
           res.status(400).json("user already exists")
       }else   {
       //Save User
       const newUser = new User({
           username: req.body.username,
       });
   
       const user = await newUser.save()
       try{
   
           res.status(200).json({
               _id: user.id,
               username: user.username,
               token:generateToken(user._id)
           })
       }catch(err){
           res.status(500).json(err)
       }
   }
   
});

//LOGIN WITH ONLY USERNAME
router.post("/login", async(req,res)=>{
    const {username} = req.body;
    
    //check if email exists
    const user = await User.findOne({username})
    if(!user){
        res.status(400).json("wrong credentials!")
        //compare password with password in DB
    }else if(user){
        res.json({
            _id: user.id,
            username: user.username,
            token:generateToken(user._id)
        })
    }else{
        res.status(500).json(`invalid credentials`)
    }
    
    })
    
//GENERATE JWT

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SEC,{
        expiresIn:'1d',
    })
}


export default router;