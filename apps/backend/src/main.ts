import "./config/envVars.ts";
import { allowedOrigins} from "./constants.ts";
import { FileWritable } from "./streams/FileWritable.ts";
import { sanitizePath } from "./utils/sanitizePath.ts";
import { FileRouter } from "./FileRouter/router.ts";
import { errors } from "./middlewares/errors.ts";
import { serveStatic } from "@hono/node-server/serve-static";
import { join } from "node:path";
import { cors } from "hono/cors";
import mime from "mime-types";
import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { serve } from "@hono/node-server";
import * as boom from '@hapi/boom';

const storageFolder = process.env.storageFolder;

const app = new Hono();
app.use(
  "/*",
  cors({
    origin: (origin, _c) => {
      return allowedOrigins.includes(origin) || !origin ? origin : undefined;
    },
  }),
);
app.onError(errors);
app.use(
  "/styles/index.css",
  serveStatic({ path: "./src/static/styles/index.css" }),
);
app.use("/ts/index.ts", serveStatic({ path: "./src/static/ts/index.ts" }));

app.get("/",async (c) => {
  const htmlContent = await readFile(join(process.cwd(), "src", "static", "views", "index.html"));
  return c.html(htmlContent.toString());
});

app.post("/upload", async (c) => {
  const path = c.req.header("X-File-Path");
  const body = await c.req.parseBody();
  const files = body["files[]"];
  if (!path) {
    throw  boom.badRequest("no path sended");
  }

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return c.json({ message: "No files uploaded" }, 400);
  }
  const fileArray = Array.isArray(files) ? files : [files];
  const processedFiles = await Promise.all(
    fileArray.map(async (file) => {
      if (!(file instanceof File)) {
        throw boom.unsupportedMediaType("The files are not supported by its formats");
      }
      const safeFolder = sanitizePath(join(path, file.name));
      const fileStream = new FileWritable(join(storageFolder, safeFolder));
      await file.stream().pipeTo(fileStream);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }),
  );

  return c.json({ message: "files uploaded", files: processedFiles }, 200);
});

app.get("/download", async (c) => {
  const path = c.req.header("X-File-Path");
  if (!path) {
    throw boom.badRequest("no path specified");
  }
  console.log(path);
  const safePath = sanitizePath(join(path));
  const file = await readFile(join(storageFolder, safePath));
  const mimeType = mime.lookup(safePath) || "text";
  return c.body(file as any, 202, {
    "Content-Disposition": `attachment; filename=${safePath}`,
    "Content-Type":mimeType
  });
});

app.route("/file", FileRouter);

serve({
  fetch:app.fetch,
  port:8000
},(info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
