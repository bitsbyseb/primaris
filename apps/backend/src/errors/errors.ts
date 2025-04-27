export class AbortedStream extends Error {
    constructor(public msg:string) {
      super(msg);
      this.name = "AbortedStream";
    }
}

export class NotHttpParams extends Error {
  constructor(public msg:string) {
    super(msg);
    this.name = "NoHttpParams"
  }
}