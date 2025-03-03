import { allowedOrigins, storageFolder } from "./constants.js";
import { FileWritable } from "./streams/FileWritable.js";
import { sanitizePath } from "./utils/sanitizePath.js";
import { FileRouter } from "./FileRouter/router.js";
import { NotHttpParams } from "./errors/errors.js";
import { errors } from "./middlewares/errors.js";
import { serveStatic } from "@hono/node-server/serve-static";
import { join } from "node:path";
import { cors } from "hono/cors";
import mime from "mime-types";
import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { serve } from "@hono/node-server";

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
app.use("/js/index.js", serveStatic({ path: "./src/static/js/index.js" }));

app.get("/",async (c) => {
  const htmlContent = await readFile(join(process.cwd(), "src", "static", "views", "index.html"));
  return c.html(htmlContent.toString());
});

app.post("/upload", async (c) => {
  const path = c.req.header("X-File-Path");
  const body = await c.req.parseBody();
  const files = body["files[]"];
  if (!path) {
    throw new NotHttpParams("no path sended");
  }

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return c.json({ message: "No files uploaded" }, 400);
  }
  const fileArray = Array.isArray(files) ? files : [files];
  const processedFiles = await Promise.all(
    fileArray.map(async (file) => {
      if (!(file instanceof File)) {
        // TODO: create a new error instance
        // throw new InvalidData(
        //   "The files are not supported by ijs formajs",
        // );
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
    throw new NotHttpParams("no path specified");
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
