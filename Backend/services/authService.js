import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { readUsers } from './dataSrore.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "78787878yuyuuyu67545";

export const signToken = (user)=>{
    return jwt.sign({id:user.id, agentCode:user.agentCode, role: user.role},JWT_SECRET,{
        expiresIn: "5h"
    })
}

export const verifyToken = (token)=>{
    return jwt.verify(token,JWT_SECRET);
};

export const loginUser = async(agentCode, password)=>{
    const users = await readUsers();
    const match = users.find((user)=>user.agentCode === agentCode);
    if(!match){
        return null
    }
    return match.passwordHash === password ? match : null
}