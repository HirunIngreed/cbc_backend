import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
       productId : {
        type : String,
        required : true
       },
       productName : {
        type : String,
        required : true,
        unique : true
       },
       altNames : [
        {
            type : String,
            required : true,
        }
       ],
       isAvailable : {
        type : Boolean,
        required : true,
        default : true
       },
       description : {
        type : String,
        required : true
       },
       img : {
        type : String,
        required : true
       },
       price : {
        type : Number,
        required : true
       },
       labeledPrice : {
        type : Number,
        required : true
       },
       date :{
            type : Date,
            default : Date.now
        }

    }
)
const Product = mongoose.model("product",productSchema)

export default Product;