import {lstat} from 'node:fs/promises';
export async function fileExists(path: string):Promise<boolean> {
  try {
    await lstat(path);
    return true;
} catch (err) {
    // if (!(err instanceof Deno.errors.NotFound)) {
      // throw err;
    // }
    return false;
}
}
