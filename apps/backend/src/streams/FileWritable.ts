import { AbortedStream } from "../errors/errors.js";
import * as fs from "node:fs";

export class FileWritable extends WritableStream {
  private fileStream: fs.WriteStream;

  constructor(public uploadPath: string | URL) {
    let fileStream: fs.WriteStream;

    super({
      write(chunk) {
        return new Promise<void>((resolve, reject) => {
          fileStream.write(chunk, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      },
      close() {
        fileStream.end();
      },
      abort(reason) {
        fileStream.destroy();
        throw new AbortedStream("Stream Aborted: " + reason);
      },
    });

    fileStream = fs.createWriteStream(uploadPath);
    this.fileStream = fileStream;
  }
}
