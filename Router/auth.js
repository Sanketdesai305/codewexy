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
           nickname: req.body.nickname,
           total_products_on_sell:req.body.total_products_on_sell,
           status:req.body.status,
       });
   
       const user = await newUser.save()
       try{
   
           res.status(200).json({
               _id: user.id,
               username: user.username,
               nickname: user.nickname,
               total_products_on_sell: user.total_products_on_sell,
               total_earning:user.total_earning,
               total_balance:user.total_balance,
               status:user.status,
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
    const status = user.status.includes(0)
    if(!user){
        res.status(400).json("wrong credentials!")
        //compare password with password in DB
    }else if(status === true){
        res.status(400).json("your status is 0 cannot login!")
    }else if(user){
        res.json({
            _id: user.id,
            username: user.username,
            nickname: user.nickname,
            total_products_on_sell: user.total_products_on_sell,
            total_earning:user.total_earning,
            total_balance:user.total_balance,
            status:user.status,
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