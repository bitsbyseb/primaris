import {lstat} from 'node:fs/promises';
import {lstatSync} from 'node:fs';
export async function fileExists(path: string):Promise<boolean> {
  try {
    await lstat(path);
    return true;
} catch (err) {
    return false;
}
}


export function fileExistsSync(path: string):boolean {
  try {
    lstatSync(path);
    return true;
} catch (err) {
    return false;
}
}
