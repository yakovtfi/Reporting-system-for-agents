import {randomUUID} from 'crypto';
import { atbash } from './atbash.js';
import { readUsers, writeUsers } from './dataSrore.js';


export const createUser = async (input)=>{
    const users = await readUsers();
    const exists = users.some((user)=> user.agentCode === input.agentCode);
    if(exists){
        throw new Error("AGENT_CODE_EXISTS");
    }
    const providedPassword = (input.password ?? "").trim();
    const initialPassword = providedPassword || atbash((input.fullName ?? "").trim());
    const user = {
        id : randomUUID(),
        agentCode: input.agentCode,
        fullName: input.fullName,
        passwordHash: initialPassword,
        role: input.role,
        createdAt: new Date().toISOString(),
    };
    const updated = [...users, user];
    await writeUsers(updated);
    return {user, initialPasswordHint: initialPassword};
};

export const listUsers = async () => readUsers();

export const findUserById = async (id) =>{
    const users = await readUsers();
    return users.find((user) => user.id === id)
}

export const findUserByAgentCode = async(agentCode)=>{
    const users = await readUsers();
    return users.find((user)=> user.agentCode ===agentCode)
}