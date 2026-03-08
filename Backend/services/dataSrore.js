import path from 'path';
import fs from 'fs/promises';

const datadir = path.join(__dirname, "..", "data");

let cachedUsers = null;
let cachedReports = null;

const readJson = async(fileName)=>{
    const filePath = path.join(datadir,fileName);
    const raw = await fs.readFile(filePath, 'utf-8');
    if(!raw.trim()){
        return null;
    }
    return JSON.parse(raw)
}

const writeJson = async (fileName,data)=>{
    const filePath = path.join(datadir,fileName);
    await fs.mkdir(path.dirname(filePath))
    await fs .writeFile(filePath, JSON.stringify(data, null, 2),'utf-8')
};

export const readUsers = async () => {
  if (!cachedUsers) {
    const data = await readJson("Agent.json");
    cachedUsers = data ?? [];
  }
  return cachedUsers;
};

export const writeUsers = async (users)=>{
    if(!users){
        throw new Error("No users provided to write");
    }
    cachedUsers = users;
    await writeJson("Agent.json",cachedUsers)
}

export const readReports = async()=>{
    if(!cachedReports){
        const data = await readJson("Report.json");
        cachedReports = data ?? [];
    }
    return cachedReports
}

export const writeReports = async(reports)=>{
    if(!reports){
        throw new Error ("No reports provided to write");
    }
    cachedReports = reports;
    await writeJson("Report.json",cachedReports)
}