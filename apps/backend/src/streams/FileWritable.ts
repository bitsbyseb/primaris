import { AbortedStream } from "../errors/errors.js";
import * as fs from 'node:fs';
export class FileWritable extends WritableStream {
  private file:  Buffer | undefined;
  private data:Uint8Array | undefined;
  constructor(public uploadPath: string | URL) {
    super({
      write: (chunk) => {
        if (this.file && !this.data) {
        this.data = chunk;
        }
      },
      close:() => {
        if (this.file && this.data) {
          this.file.write(this.data.toString());
        }
      },
      abort:() => {
        throw new AbortedStream("Stream Aborted");
      }
    });
    this.file = fs.readFileSync(uploadPath);
  }
}