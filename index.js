import express from "Express";
import productRoute from "./Router/product.js";
import authRoute from "./Router/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser"
dotenv.config();
const app = express();
app.use(bodyParser.json());
//DB Connection
mongoose.connect(process.env.URL).then(()=>{
    console.log("DB connection successfull!")
}).catch((err)=>{console.log(err)});

//Endpoints
app.use('/users',authRoute)
app.use('/products',productRoute)

//Server connection
app.listen(process.env.PORT || 5000,()=>{
    console.log(`listening on ${process.env.PORT || 5000}`)
})