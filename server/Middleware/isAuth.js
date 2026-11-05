import jwt from "jsonwebtoken"


export const isAuth = async (req, res,next)=>{
    try{
    const token = req.cookies.token

    if(!token){
        return res.status(400).json({message : "user dont have token"})
    }

    const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
    if(!verifyToken) return res.status(400).json({message:"no valid token"})

    req.userId=verifyToken.userId
    next()

    }catch(error){
  console.log("IS AUTH ERROR",error)
    }
}