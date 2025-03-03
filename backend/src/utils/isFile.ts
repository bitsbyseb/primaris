import {lstatSync} from 'node:fs';
import { join } from 'node:path';
import { storageFolder } from '../constants.js';

export function isFile(filename:string):boolean {
    return lstatSync(filename).isDirectory();
}
