import { join } from "node:path";
import { fileExists } from "./utils/fileExists.ts";
const pathEnv = Deno.env.get("storageFolder");

export const allowedOrigins = ["https://localhost:3000","http://localhost:5174"];
export const storageFolder = !pathEnv || !(await fileExists(pathEnv)) 
? join(Deno.cwd(),'files') 
: pathEnv;