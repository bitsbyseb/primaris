import {lstatSync} from 'node:fs';

export function isFile(filename:string):boolean {
    return lstatSync(filename).isDirectory();
}
