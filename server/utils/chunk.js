import fsExtra from "fs-extra";
import path from 'path';

const fse = fsExtra;
export async function mergeChunk(chunkDir, targetDir, fileName) {
  try {
    const chunkFiles = (await fse.readdir(chunkDir)).sort((a, b) => Number(a) - Number(b));
    const targetFileName = path.join(targetDir, fileName);
    const writeStream = fse.createWriteStream(targetFileName);
    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(chunkDir, chunkFile);
      const data = await fse.readFile(chunkPath);
      writeStream.write(data);
    }
    await new Promise(resolve => writeStream.end(resolve));
    await fse.remove(chunkDir);
  } catch(e) {
    console.log('merge chunk failed', e)
  }
}