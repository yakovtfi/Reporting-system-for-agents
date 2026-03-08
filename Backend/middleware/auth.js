import { verifyToken } from "../services/authService.js";

export const requireAuth = (req, res ,next) =>{
    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")){
        res.status(401).json({message:"Missing or invalid token"});
        return;
    }
    try{
        const payload = verifyToken(header.replace("Bearer ", "").trim());
        req.user = payload;
        next();
    }catch(_err){
        res.status(401).json({message: "invalid token"})
    }
};

