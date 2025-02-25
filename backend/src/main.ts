import { allowedOrigins, storageFolder } from "./constants.ts";
import { FileWritable } from "./streams/FileWritable.ts";
import { sanitizePath } from "./utils/sanitizePath.ts";
import { FileRouter } from "./FileRouter/router.ts";
import { NotHttpParams } from "./errors/errors.ts";
import { errors } from "./middlewares/errors.ts";
import { serveStatic } from "hono/deno";
import { join } from "node:path";
import { cors } from "hono/cors";
import mime from "mime-types";
import { Hono } from "hono";
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
  return c.html(
    await Deno.readTextFile(
      join(Deno.cwd(), "src", "static", "views", "index.html"),
    ),
  );
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
        throw new Deno.errors.InvalidData(
          "The files are not supported by its formats",
        );
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
  const file = await Deno.readFile(join(storageFolder, safePath));
  const mimeType = mime.lookup(safePath);
  return c.body(file, 202, {
    "Content-Disposition": `attachment; filename=${safePath}`,
    "Content-Type": mimeType,
  });
});

app.route("/file", FileRouter);

Deno.serve(app.fetch);
