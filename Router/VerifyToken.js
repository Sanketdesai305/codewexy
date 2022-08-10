import jwt from "jsonwebtoken";

import User from "../models/User.js"
import Ticket from "../models/Ticket.js"



const protect = (async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SEC)

      // Get user from the token
      req.user = await User.findById(decoded.id)

      next()
    } catch (error) {
      console.log(error)
      res.status(401).json('Not authorized')
    }
  }

  if (!token) {
    res.status(401).json('Not authorized, no token')
  }
});
//CHECK IF AUTHORIZED USER OR ADMIN
const VerifyTokenAndAutherization = (req,res,next)=>{
  protect(req,res,async ()=>{
    const name = req.user.username;
    console.log(name)
    const bodyTicket = await Ticket.findById(req.body.ticketId)
    console.log(bodyTicket);
    const tickets = await Ticket.aggregate(
      [ { $match : { assignedTo : name } } ]
  );
  const P =(tickets.map((ticket)=>{return ((ticket.priority).includes('high'))}))
  const Pm = P.includes(true)
  console.log(Pm)
    if(name === bodyTicket.assignedTo && Pm!==true){
      next();
    }else if( req.user.isAdmin ===true){
          next();
      }else if(Pm===true){
      const pending = JSON.stringify(tickets.filter((ticket)=>(ticket.priority).includes('high')))
        res.status(200).send(`A higher priority task remains to be closed${pending}`)

      }else{
          res.status(403).json("you are not allowed to do that!")
      }
  });
};
//check if is admin
 const VerifyTokenAndAdmin = (req,res,next)=>{
    protect(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not allowed to do that!")
        }
    });
};

export {VerifyTokenAndAdmin,VerifyTokenAndAutherization}