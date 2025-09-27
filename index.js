import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/UserRouter.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import productRouter from './routes/ProdutRouter.js';
import orderRouter from './routes/OrderRouter.js';
import cors from 'cors';

dotenv.config();



const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use((req,res,next)=>{
    const tokenString = req.header("Authorization");
        if (tokenString!=null) {
            const token = tokenString.replace("Bearer ","");
            jwt.verify(token,process.env.JWT_KEY,(err,decoded)=>{
                if (!decoded) {
                    res.json(
                        {
                            message : "Your token is invalid"
                        }
                    )
                }else{
                    req.user = decoded
                    next();
                }
            })
        }else{
            next();
        }
    

    
})

app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter);

await mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("DataBase is connected")
}).catch(()=>{
    console.log("DataBase is not connected")
})

app.listen(5000,()=>{
    console.log("App is started...")
})