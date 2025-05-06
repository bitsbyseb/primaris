import { mkdir, readdir, readFile, rmdir, unlink } from "node:fs/promises";
import { sanitizePath } from "../../utils/sanitizePath.ts";
import { join } from "node:path";
import * as boom from "@hapi/boom";
import { FileWritable } from "../../streams/FileWritable.ts";
import mime from "mime-types";
import type { FileModel } from "../../models/File.model.ts";
import { isFile } from "../../utils/isFile.ts";

const { storageFolder } = process.env;

interface UploadFilesResult {
    name: string;
    size: number;
    type: string;
}

interface listDirectoryResult {
    name: string;
    children: FileModel[];
}

interface DownloadFileResult {
    file: Buffer;
    mimeType: string;
    safePath: string;
}

export class TextFile {
    constructor(public filename: string, public path: string) {
    }

    public async read(): Promise<string> {
        const safePath = sanitizePath(this.path);
        const content = await readFile(join(storageFolder, safePath));
        return content.toString('utf-8');
    }

    public async download(): Promise<DownloadFileResult> {
        const safePath = sanitizePath(join(this.path,this.filename));
        const file = await readFile(join(storageFolder, safePath));
        const mimeType = mime.lookup(safePath) || "text";
        return {
            file,
            mimeType,
            safePath,
        };
    }

    public async remove():Promise<void> {
        const safePath = sanitizePath(join(this.path, this.filename));
        await unlink(join(storageFolder, safePath));
    }
}

export class Directory {
    constructor(public dirName:string,public path:string) {
    }

    public async make(): Promise<void> {
        const safePath = sanitizePath(join(this.path, this.dirName));
        const finalPath = join(storageFolder, safePath);
        await mkdir(finalPath);
    }
    
    public async list(): Promise<listDirectoryResult> {
        const safePath = sanitizePath(join(this.path,this.dirName));
        const content = await readdir(join(storageFolder, safePath));
        const info: listDirectoryResult = {
            name: safePath,
            children: [],
        };
        for (const element of content) {
            info.children.push({
                name: element,
                isDirectory: isFile(
                    join(storageFolder, safePath, element),
                ),
            });
        }

        return info;
    }

    public async uploadFiles(
        files: (string | File | any)[],
    ): Promise<UploadFilesResult[]> {
        const promises = files.map(async (file) => {
            if (!(file instanceof File)) {
                throw boom.unsupportedMediaType(
                    "The files are not supported by its formats",
                );
            }
            const safeFolder = sanitizePath(join(this.path, file.name));
            const fileStream = new FileWritable(
                join(storageFolder, safeFolder),
            );
            await file.stream().pipeTo(fileStream);
            return {
                name: file.name,
                size: file.size,
                type: file.type,
            };
        });

        const processedFiles = await Promise.all(promises);
        return processedFiles;
    }

    public async remove(): Promise<string> {
        const safePath = sanitizePath(join(this.path, this.dirName));
        const finalPath = join(storageFolder, safePath);
        await rmdir(finalPath, { recursive: true });
        return safePath;
    }
}
