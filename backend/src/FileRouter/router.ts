import { Hono } from "hono";
import { join } from "node:path";
import { NotHttpParams } from "../errors/errors.ts";
import { sanitizePath } from "../utils/sanitizePath.ts";
import { storageFolder } from "../constants.ts";

const app = new Hono();

app.get("/cat",async (c) => {
  const path = c.req.header("X-File-Path");
  console.log(path);
  if (!path) {
    throw new NotHttpParams("No path sended");
  }
  const safePath = sanitizePath(path);
  const content = await Deno.readTextFile(join(storageFolder, safePath));
  return c.json({
    result: content,
  }, 302);
});

app.post("/mkdir", async (c) => {
  const dirName = c.req.query("dirName");
  const destiny = c.req.header("X-File-Path");
  if (!destiny || !dirName) {
    throw new NotHttpParams("no directory or path destiny sended");
  }
  const safePath = sanitizePath(join(destiny,dirName));
  const finalPath = join(storageFolder,safePath);
  await Deno.mkdir(finalPath);

  return c.json({
    name: dirName,
    destiny,
  }, 201);
});

app.get("/ls",async (c) => {
  const directory = c.req.header("X-File-Path");
  if (!directory) {
    throw new NotHttpParams("no path sended");
  }
  const safePath = sanitizePath(directory);
  const content = Deno.readDir(join(storageFolder,safePath));
  const info: { name: string; children: Deno.DirEntry[] } = {
    name: safePath,
    children: [],
  };
  for await (const element of content) {
    info.children.push(element);
  }
  return c.json(info, { status: 200 });
});

app.delete("/rmdir", async (c) => {
  const dirName = c.req.query("dirName");
  const destiny = c.req.header("X-File-Path");
  if (!destiny || !dirName) {
    throw new NotHttpParams("no directory or path destiny sended");
  }
  const safePath = sanitizePath(join(destiny,dirName));
  const finalPath = join(storageFolder,safePath);
  await Deno.remove(finalPath,{recursive:true});

  return c.json({
    name: dirName,
    destiny:safePath,
  }, 202);
});

app.delete("/rm", async (c) => {
  const filename = c.req.query("filename");
  const destiny = c.req.header("X-File-Path");
  if (!filename || !destiny) {
    throw new NotHttpParams("no filename or path were specified");
  }

  const safePath = sanitizePath(join(destiny,filename));
  await Deno.remove(join(storageFolder,safePath));

  return c.json({
    name: filename,
    destiny,
  }, 201);
});

export { app as FileRouter };
