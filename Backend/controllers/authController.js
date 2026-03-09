import { loginUser, signToken } from "../services/authService.js";
import { findUserById } from "../services/userService.js";

export const login = async (req, res) => {
    const {agentCode, password} = req.body || {};
    if(!agentCode || !password){
        res.status(400).json({message: "agentCode and password are required"})
        return;
    }
    const user = await loginUser(agentCode, password);
    if(!user){
        res.status(401).json({message: "invalid user"});
        return
    } 
    const token = signToken(user);
    res.json({
        token,
        user:{
            id: user.id,
            agentCode: user.agentCode,
            fullName: user.fullName,
            role: user.role,
        },
    });
};

export const me = async (req, res) =>{
    if(!req.user){
    res.status(401).json({ message: "Missing user" });
    return;
    }
    const user = await findUserById(req.user.id);
    if(!user){
        res.status(401).json({message: "User not found"})
        return;
    }
    res.json({
        user:{
            id: user.id,
            agentCode: user.agentCode,
            fullName: user.fullName,
            role: user.role,
        }
    })
}