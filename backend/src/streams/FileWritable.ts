import { AbortedStream } from "../errors/errors.ts";

export class FileWritable extends WritableStream {
  private file: Deno.FsFile | undefined;
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
          this.file.write(this.data);
        }
      },
      abort:() => {
        throw new AbortedStream("Stream Aborted");
      }
    });
    this.file = Deno.openSync(uploadPath, {
      createNew: true,
      write: true,
      append: true,
    });
  }
}