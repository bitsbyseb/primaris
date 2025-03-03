export interface FileResponse {
    name: string,
    isDirectory: boolean,
}
  
export interface DirectoryResponse extends FileResponse {
    children: (FileResponse | DirectoryResponse)[]
}