import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type: ['open','closed'],
        default:'closed',
    },
    priority:{
        type:['low','medium','high'],
        required:true,
        default:'low',
    },
    assignedTo:{
        type:String,
        required:true,
    },
},{timestamps:true});

export default mongoose.model("Ticket",ticketSchema);
