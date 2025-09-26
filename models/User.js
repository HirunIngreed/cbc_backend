import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true 
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            required : true,
            default : "coustomer"
        }
    }
)
const User = mongoose.model("users",userSchema);

export default User;
