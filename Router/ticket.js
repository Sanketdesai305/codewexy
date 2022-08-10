import express from 'express';
// import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import Ticket from "../models/Ticket.js"
import dotenv from "dotenv"
import {VerifyTokenAndAdmin,VerifyTokenAndAutherization} from "./VerifyToken.js";

dotenv.config();
var router = express.Router();
router.use(bodyParser.json());
router.post('/new', VerifyTokenAndAdmin , async(req,res)=>{
  
    //Save Ticket
    const newTicket = new Ticket({
        title:req.body.title,
        description:req.body.description,
        status:req.body.status,
        priority:req.body.priority,
        assignedTo:req.body.assignedTo,
    });

    const ticket = await newTicket.save()
    try{

        res.status(200).json({
            _id: ticket.id,
        })
    }catch(err){
        res.status(500).json(err)
    }

});

//GET TICKET BY STATUS/PRIORITY/TITLE/ALL

router.get("/find",async (req,res)=>{
    const paramTitle = req.query.title;
    const paramPriority = req.query.priority;
    const paramStatus = req.query.status;
    try{
        if(paramTitle){
            const ticket = await Ticket.aggregate(
                [ { $match : { title : paramTitle } } ]
            );
            res.status(200).json(ticket)
        }else if(paramPriority){      
        const ticket = await Ticket.find(
            { priority :{ $in: [paramPriority] }} 
       );
       res.status(200).json(ticket)
    }else if(paramStatus){      
        const ticket = await Ticket.find(
             { status :{ $in: [paramStatus] }} 
        );
        res.status(200).json(ticket)
    }else{
       const ticket =  await Ticket.find()
       res.status(200).json(ticket)
        }
        
    }catch(err){
        res.status(500).json(err)
    }
});

// UPDATE TICKET STATUS TO CLOSED BY ONLY AUTHORIZED USER OR ADMIN
//CONDITION IF USER HAS ANY HIGH PRIORITY TICKETS ASSIGNED TO HIM HE CANNOT CLOSE TICKET

router.put("/markAsClosed",VerifyTokenAndAutherization,async(req,res)=>{ 
    try{
        const updatesticket = await Ticket.findByIdAndUpdate(req.body.ticketId,{
            $set: {status : 'closed'}
        }, {new:true});
        res.status(200).json(updatesticket)
    }catch(err){
        res.status(500).json(err)
    }

});

// DELETE A TICKET BY ADMIN ONLY ACCEPTS TICKETID AS BODY PARAM
router.delete("/delete", VerifyTokenAndAdmin,async (req,res)=>{
    try{
        await Ticket.findByIdAndDelete(req.body.tokenId)
        res.status(200).json("Ticket has been deleted...")
    }catch(err){
        res.status(500).json(`you are not allowed to delete tickets${err}`)
    }
});

export default router;