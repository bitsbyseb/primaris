import { serviceUrl } from "../../constants";
import type { DirectoryResponse, FileResponse } from "../../models/file.model";
interface getFileContentParams {
    filename: string;
    path: string;
    isTextFile: boolean;
}

export class FileService {
    /**
     * determines if a subject is neither a directory or not
     * @param subject the file or directory to be evaluated
     * @returns whether it is a directory or not
     */
    static isDirectory(
        subject: FileResponse | DirectoryResponse,
    ): subject is DirectoryResponse {
        return subject.isDirectory;
    }

    /**
     * gets file content and then download it into the users file system.
     * @param path the directory where is the file, without the filename.
     * @param filename the name of your file.
     * @param anchorID where we are going to assign and revoke the url of the file.
     */
    static async downloadCallback(
        path: string,
        filename: string,
        anchorID: string,
    ):Promise<void> {
        try {
            const res = await fetch(serviceUrl + "/file/download", {
                method: "GET",
                headers: {
                    "X-File-Path": path+filename,
                },
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const anchor = document.querySelector<HTMLAnchorElement>(
                `#${anchorID}`,
            );
            if (!anchor) {
                return;
            }
            anchor.href = url;
            anchor.download = filename;
            anchor.click();
            URL.revokeObjectURL(url);
        } catch {
            console.error("download operation went wrong");
        }
    }

    /**
     * makes a new directory
     * @param dirName the name of the directory
     * @param path where the directory is, without the directory name
     */
    static async createDirectory(dirName: string, path: string):Promise<void> {
        try {
            await fetch(`${serviceUrl}/file/mkdir?dirName=${dirName}`, {
                method: "POST",
                headers: {
                    "X-File-Path": path,
                },
            });
        } catch {
            console.error("couldn't create directory");
        }
    }

    /**
     * pushes a file into the remote service
     * @param path where the file will be.
     * @param form an HtmlFormElement which has the file data.
     */
    static async uploadFile(path: string, form: HTMLFormElement):Promise<void> {
        try {
            const data = new FormData(form);
            await fetch(serviceUrl + "/file/upload", {
                method: "POST",
                body: data,
                headers: {
                    "X-File-Path": path,
                },
            });
        } catch {
            console.error("something went wrong with upload file operation");
        }
    }

    /**
     * deletes the las directory from the current path
     * @param path the source or current location
     * @returns the path without the las directory
     */
    static goUpPath(
        path: string,
    ):string {
        const asArr = path.split("/");
        const newPath: string[] = [];
        for (const dir of asArr) {
            if (dir) {
                newPath.push(dir);
            }
        }
        newPath.pop();
        let result = "/" + newPath.join("/");
        if (newPath.length > 0) {
            result = result + "/";
        }
        return result;
    }
    /**
     * 
     * @param getFileParams mandatory parameters to get the file content and handle request
     * @returns 
     */
    static async getFileContent(getFileParams: getFileContentParams) {
        try {
            const { filename, path, isTextFile} =
                getFileParams;
            const res = await fetch(serviceUrl + "/file/download", {
                method: "GET",
                headers: {
                    "X-File-Path": path + filename,
                },
            });
            const blob = await res.blob();
            if (isTextFile) {
                const text = await blob.text();
                return text;
            }
        } catch (error) {
            console.error(error);
        }
    }

    static async deleteFile(
        path: string,
        file: DirectoryResponse | FileResponse,
    ) {
        try {
            if (FileService.isDirectory(file)) {
                await fetch(
                    serviceUrl + "/file/rmdir?dirName=" + file.name,
                    {
                        method: "DELETE",
                        headers: {
                            "X-File-Path": path,
                        },
                    },
                );
                return;
            }
            await fetch(serviceUrl + "/file/rm?filename=" + file.name, {
                method: "DELETE",
                headers: {
                    "X-File-Path": path,
                },
            });
        } catch (error) {
            console.error(error);
        }
    }
}
