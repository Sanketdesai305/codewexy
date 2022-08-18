import express from 'express';
// import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import Product from "../models/Product.js"
import dotenv from "dotenv"
import {VerifyTokenAndAdmin,VerifyTokenAndAutherization} from "./VerifyToken.js";

dotenv.config();
var router = express.Router();
router.use(bodyParser.json());
router.post('/new', VerifyTokenAndAutherization , async(req,res)=>{
  
    //Save Product
    const newProduct = new Product({
        productTitle:req.body.productTitle,
        totalQuantity:req.body.totalQuantity,
        remainQuantity:req.body.remainQuantity,
        productPrice:req.body.productPrice,
        productImage:req.body.productImage,
    });

    const product = await newProduct.save()
    try{

        res.status(200).json({
            _id: product.id,
            title: product.productTitle,
            quantity:product.totalQuantity,
            remaining:product.remainQuantity,
            price:product.productPrice,
            image:product.productImage,
        })
    }catch(err){
        res.status(500).json(err)
    }

});

//VIEW ALL PRODUCTS
router.get("/find",async (req,res)=>{
    try{
        const product =  await Product.find()
       res.status(200).json(product) 
    }catch(err){
        res.status(500).json(err)
    }
});

//BUY A PRODUCT
router.put("/buy",VerifyTokenAndAutherization ,async(req,res)=>{ 
    try{
        const updatesproduct = await Product.findByIdAndUpdate(req.body.productId, {
            $set: {remainQuantity : {$subtract:["$remainQuantity" , "$productQ"]}}
        }, {new:true});
        res.status(200).json(`Thank you for the purchase ${updatesproduct}`)
    }catch(err){
        res.status(500).json(err)
    }

});
export default router;