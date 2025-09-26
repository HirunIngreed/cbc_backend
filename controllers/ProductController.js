import { response } from "express";
import Product from "../models/Product.js";
import { isAdmin } from "./UserController.js";

export async function createProduct(req,res){
    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message : "Only admins can add products"
            }
        )
        return
    }
    //genarate productId
    let productId = "PRD000001";

    const lastProduct = await Product.find().sort({date : -1}).limit()
    
    if(lastProduct.length > 0){
    const productIdString = lastProduct[0].productId.replace("PRD","");
    const productIdNumber = parseInt(productIdString);
    const newProductIdNumber = productIdNumber + 1;
    const newProductIdString = String(newProductIdNumber).padStart(6,"0");
    productId = "PRD" + newProductIdString;
    }
try{
    const product = new Product(
        {
            productId : productId,
            productName : req.body.productName,
            altNames : req.body.altNames,
            isAvailable : req.body.isAvailable,
            description : req.body.description,
            img : req.body.img,
            price : req.body.price,
            labeledPrice : req.body.labeledPrice
        }
    )
    const savedProduct = await product.save()
    res.json(
        {
            message : "Product is saved successfully",
            product : savedProduct
        }
    )
 
}catch(err){
    console.log(err)
}
}

export async function retrieveProduct(req,res){
    try{
    if (isAdmin(req)) {
        const products = await Product.find()
        res.json(
            {
                products : products
            }
        )
        return
    }
    const products = await Product.find({isAvailable : true})
    res.json(
        {
            products : products
        }
    )

}catch(err){
    console.log(err)
}
}

export async function retrieveProductById(req,res){
    const product = await Product.findOne({productId : req.params.productId})
    
try{
    if (!req.user) {
        res.json(
            {
                message : "You not login to website"
            }
        )
        return
    }

    if (product==undefined) {
        res.json(
            {
                message : "There is no product in this name"
            }
        )
        return
    }
  
    if (!isAdmin(req)) {
       if (product.isAvailable==false) {
        res.json(
            {
                message : "This product is out of stock"
            }
        )
       }else{
        res.json(
            {
                product : product
            }
        )
       }
    }else{
        res.json(
            {
                message : product
            }
        )
    }   
}catch(err){
    console.log(err)
}
}
   
export async function uptateProduct (req,res){
    try{
    if (!isAdmin(req)) {
        res.json(
            {
                message : "Only admins can update products"
            }
        )
        return
    }
    if (req.body==null) {
        res.json(
            {
                message : "You have not enterd eny data to update"
            }
        )
        return
    }
    await Product.updateOne({productId : req.params.productId},req.body)
    res.json(
        {
            message : "Update is successfull"
        }
    )
}catch(err){
    res.json(
        {
            message : "Product is not updated"
        }
    )
}
} 

export async function deleteProduct(req,res){
try{
    if (req.user==null) {
        res.json(
            {
                message : "You are not login to website"
            }
        )
        return
    }
    if (!isAdmin(req)) {
        res.json(
            {
                message : "Product deleted successfull",
            }
        )
        return
    }

    await Product.deleteOne({productId : req.params.productId})
    res.json(
        {
            message : "Product deletesd successfull"
        }
    )
}catch(err){
    res.json(
        {
            message : "Product is not deleted"
        }
    )
}
}