import { z } from "zod";

const envVars = z.object({
    storageFolder: z.string({required_error:"storageFolder is required on .env file"}),
    MYSQL_PORT:z.string(),
    MYSQL_USER:z.string().max(20),
    MYSQL_PASSWORD:z.string().max(20),
    SALT_ROUNDS:z.string(),
    HASH_PASSWORD:z.string().max(50),
    JSON_WEB_TOKEN_SECRET:z.string()
});

envVars.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv  extends z.infer<typeof envVars> {}
    }
}