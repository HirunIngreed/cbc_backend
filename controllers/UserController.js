import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import bcrypt from 'bcrypt';

export async function createUser(req,res){

try{

    if (req.body.role == "admin") {
        if (!isAdmin(req)) {
            res.json(
                {
                    message : "You can't creat admin accounts"
                }
            )
        }
    }

    const duplicateUser = await User.findOne({email:req.body.email})
        if (duplicateUser) {
            res.json(
                {
                    message : "The email you enterd is elready used"
                }
            )
            return
        }
        

        const salt = await bcrypt.genSalt(10);
        
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User(
        {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : hashedPassword,
            role : req.body.role
        }
    )
    const savedUser = await user.save()
    res.json(
        {
            message : "User added successfully",
            user : user
        }
    )
}catch(err){
    console.log(err)
}
}

export async function loginUser(req,res){

try{
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email:email})

        
    
        if (user==null) {
            res.status(403).json(
                {
                    message : "The email you entered is invalid"
                }
            )
           
        }else {
            const comparedPassword = await bcrypt.compare(password,user.password)
                if (comparedPassword) {
                const token = jwt.sign(
                    {
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        password : user.password,
                        role : user.role
                    },process.env.JWT_KEY
                    )

                    res.json(
                        {
                            message : "Login successfull",
                            token : token
                        }
                    )
                       }else{
                        res.status(403).json(
                            {
                                message : "Password is incorrect"
                            }
                        )
                       }
                    }


}catch(err){
    console.log(err)
}
}

export function isAdmin(req,res){
    if (!req.user) {
        return false
    }
    if (req.user.role != "admin") {
        return false
    }
    return true;
}