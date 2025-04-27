import { Hono } from "hono";
import { join } from "node:path";
import * as boom from '@hapi/boom';
import { sanitizePath } from "../utils/sanitizePath.ts";
import { mkdir, readdir, readFile, rmdir } from "node:fs/promises";
import { isFile } from "../utils/isFile.ts";
import type { FileModel } from "../models/File.model.ts";

const app = new Hono();
const storageFolder = process.env.storageFolder;

app.get("/cat",async (c) => {
  const path = c.req.header("X-File-Path");
  console.log(path);
  if (!path) {
    throw boom.badRequest("path is mandatory");
  }
  const safePath = sanitizePath(path);
  const content = await readFile(join(storageFolder, safePath));
  return c.json({
    result: content,
  }, 302);
});

app.post("/mkdir", async (c) => {
  const dirName = c.req.query("dirName");
  const destiny = c.req.header("X-File-Path");
  if (!destiny || !dirName) {
    throw boom.badRequest("no directory or path destiny sended");
  }
  const safePath = sanitizePath(join(destiny,dirName));
  const finalPath = join(storageFolder,safePath);
  await mkdir(finalPath);

  return c.json({
    name: dirName,
    destiny,
  }, 201);
});

app.get("/ls",async (c) => {
  const directory = c.req.header("X-File-Path");
  if (!directory) {
    throw boom.badRequest("no path sended");
  }
  const safePath = sanitizePath(directory);
  const content = await readdir(join(storageFolder,safePath));
  const info: { name: string; children: FileModel[] } = {
    name: safePath,
    children: [],
  };
  for (const element of content) {
    info.children.push({
      name:element,
      isDirectory: isFile(join(storageFolder,safePath,element))
    });
  }
  return c.json(info, { status: 200 });
});

app.delete("/rmdir", async (c) => {
  const dirName = c.req.query("dirName");
  const destiny = c.req.header("X-File-Path");
  if (!destiny || !dirName) {
    throw boom.badRequest("no directory or path destiny sended");
  }
  const safePath = sanitizePath(join(destiny,dirName));
  const finalPath = join(storageFolder,safePath);
  await rmdir(finalPath,{recursive:true});

  return c.json({
    name: dirName,
    destiny:safePath,
  }, 202);
});

app.delete("/rm", async (c) => {
  const filename = c.req.query("filename");
  const destiny = c.req.header("X-File-Path");
  if (!filename || !destiny) {
    throw boom.badRequest("no filename or path was specified");
  }

  const safePath = sanitizePath(join(destiny,filename));
  await rmdir(join(storageFolder,safePath));

  return c.json({
    name: filename,
    destiny,
  }, 201);
});

export { app as FileRouter };
