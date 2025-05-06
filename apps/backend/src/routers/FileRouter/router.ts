import { Directory,TextFile } from "../../services/FileService/file.service.ts";
import * as boom from "@hapi/boom";
import { Hono } from "hono";
import { token } from "../../middlewares/token.ts";

const app = new Hono();
app.use("*",token);


function getFileData(path:string) {
  const noSlash = path.split('/');
  let lastElement = noSlash[noSlash.length-1];
  if (Boolean(lastElement)) {
    return [lastElement,noSlash.slice(0,noSlash.length-1).join("/")]
  } else {
    lastElement = noSlash[noSlash.length-2];
    return ["/"+(lastElement),"/"+(noSlash.slice(0,noSlash.length-2).join("/"))]
  }
}


app.post("/upload", async (c) => {
  const path = c.req.header("X-File-Path");
  const body = await c.req.parseBody();
  const files = body["files[]"];
  if (!path) {
    throw boom.badRequest("no path sended");
  }

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return c.json({ message: "No files uploaded" }, 400);
  }
  const filesArray = Array.isArray(files) ? files : [files];
  const [dirName,dirPath] = getFileData(path);
  const uploadDirectory = new Directory(dirName,dirPath);
  const processedFiles = await uploadDirectory.uploadFiles(filesArray);

  return c.json({ message: "files uploaded", files: processedFiles }, 200);
});

app.get("/download", async (c) => {
  const path = c.req.header("X-File-Path");
  if (!path) {
    throw boom.badRequest("no path specified");
  }
  console.log(path);

  const [filename,filePath] = getFileData(path);
  console.log(`FILENAME:${filename} FILEPATH:${filePath}`);
  const downloadFile = new TextFile(filename,filePath);
  const { file, mimeType, safePath } = await downloadFile.download();
  return c.body(file as any, 202, {
    "Content-Disposition": `attachment; filename=${safePath}`,
    "Content-Type": mimeType,
  });
});

app.post("/mkdir", async (c) => {
  const dirName = c.req.query("dirName");
  const destiny = c.req.header("X-File-Path");
  if (!destiny || !dirName) {
    throw boom.badRequest("no directory or path destiny sended");
  }
  const newDir  = new Directory(dirName,destiny);
  await newDir.make();

  return c.json({
    name: dirName,
    destiny,
  }, 201);
});

app.get("/ls", async (c) => {
  const directory = c.req.header("X-File-Path");
  if (!directory) {
    throw boom.badRequest("no path sended");
  }
  const [dirName,dirPath] = getFileData(directory);
  const listedDirectory = new Directory(dirName,dirPath);
  const info = await listedDirectory.list();

  return c.json(info, { status: 200 });
});

app.delete("/rmdir", async (c) => {
  const dirName = c.req.query("dirName");
  const destiny = c.req.header("X-File-Path");

  if (!destiny || !dirName) {
    throw boom.badRequest("no directory or path destiny sended");
  }
  const toRemoveDir = new Directory(dirName,destiny);
  const safePath = await toRemoveDir.remove();

  return c.json({
    name: dirName,
    destiny: safePath,
  }, 202);
});

app.delete("/rm", async (c) => {
  const filename = c.req.query("filename");
  const destiny = c.req.header("X-File-Path");
  if (!filename || !destiny) {
    throw boom.badRequest("no filename or path was specified");
  }

  const toRemoveFile = new TextFile(filename,destiny);
  await toRemoveFile.remove();

  return c.json({
    name: filename,
    destiny,
  }, 201);
});

export { app as FileRouter };
