import { join } from "node:path";
import { fileExists } from "./utils/fileExists.js";
const pathEnv = process.env.storageFolder;

export const allowedOrigins = ["https://localhost:3000","http://localhost:5174"];
export const storageFolder = !pathEnv || !(await fileExists(pathEnv)) 
? join(process.cwd(),'files') 
: pathEnv;