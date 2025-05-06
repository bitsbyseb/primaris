import "./config/envVars.ts";
import { FileRouter } from "./routers/FileRouter/router.ts";
import { errors } from "./middlewares/errors.ts";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { AuthRouter } from "./routers/AuthRouter/router.ts";
import { AdminRouter } from "./routers/AdminRouter/router.ts";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:false,
    allowHeaders: ['Content-Type', 'Authorization','X-File-Path']
  }),
);
app.onError(errors);

app.route("/auth",AuthRouter);
app.route("/file",FileRouter);
app.route("/admin",AdminRouter);

serve({
  fetch:app.fetch,
  port:8000
},(info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
