export interface FileResponse {
    name: string,
    isFile: boolean,
    isDirectory: boolean,
    isSymlink: boolean
  }
  
export interface DirectoryResponse extends FileResponse {
    children: (FileResponse | DirectoryResponse)[]
}