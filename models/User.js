import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    nickname:{
        type:String,
    },
    total_products_on_sell:{
        type:Number,
        default:0,
    },
    total_earning:{
        type:Number,
        default:0,
    },
    total_balance:{
        type:Number,
        default:100,
    },
    status: {
        type:[0,1,2],
    },

});

export default mongoose.model("User",UserSchema);
