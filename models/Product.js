import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    productTitle:{
        type:String,
        required:true
    },
    totalQuantity:{
        type:Number,
        required:true
    },
    remainQuantity:{
        type:Number,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    productImage:{
        type:String,
        required:true,
    },
},{timestamps:true});

export default mongoose.model("Product",ticketSchema);
