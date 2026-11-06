import express from "express"
import dotenv from "dotenv";
import connectDB from "./Configs/connectDB.js";
import authRouter from "./Routes/auth.route.js";
import cookieParser from "cookie-parser";
import assistantRouter from "./Routes/assistant.route.js";
dotenv.config()
import cors from "cors"
import userRouter from "./Routes/user.routes.js";
import billingRouter from "./Routes/billing.route.js";


const app=express();
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
].filter(Boolean);

const privateCors = cors({
    origin: allowedOrigins,
    credentials: true
});

const publicCors = cors({
    origin: "*"
});



app.use(express.json())
app.use(cookieParser())


app.get('/' ,(req,res)=>{
    res.json("hello from me");
})

app.use("/api/auth", privateCors, authRouter);
app.use("/api/user" , privateCors, userRouter);

app.use("/api/assistant" ,publicCors, assistantRouter);
app.use("/api/billing" , privateCors , billingRouter)

const PORT= process.env.PORT;
app.listen(PORT , ()=>{
    connectDB()
    console.log(`server is running on port localhost:${PORT}`)
})
 


