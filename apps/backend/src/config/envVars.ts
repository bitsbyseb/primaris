import { z } from "zod";

const envVars = z.object({
    storageFolder: z.string({required_error:"storageFolder is required on .env file"})
});

envVars.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv  extends z.infer<typeof envVars> {}
    }
}