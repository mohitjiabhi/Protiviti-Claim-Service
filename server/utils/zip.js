import AdmZip from 'adm-zip';
import fsExtra from 'fs-extra';
import path from 'path';
const fse = fsExtra;
export const isZipFile = async (filePath) => {
  const buffer = await fse.readFile(filePath);
  return buffer[0] === 0x50 &&
         buffer[1] === 0x4B &&
         buffer[2] === 0x03 &&
         buffer[3] === 0x04;
};

export async function IsZipInsideZip(zipPath) {
  const extractedFiles = await fse.readdir(zipPath);
  return extractedFiles.some(file => file.endsWith('.zip'));
}

export async function unzip(zipPath, targetPath) {
  try {
    const zipName = path.parse(zipPath).name;
    const zipDir = path.join(targetPath, zipName);
    await fse.ensureDir(zipDir);
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(zipDir, true)
    // has any os specific files
    const macosxDir = path.join(zipDir, '__MACOSX');
    if (await fse.pathExists(macosxDir)) {
      await fse.remove(macosxDir);
    }
    const hasNestedZip = await IsZipInsideZip(zipDir);
    if(hasNestedZip) {
      await fse.remove(zipPath)
      await fse.remove(zipDir);
      throw new Error('zip should not have another zip');
    }
    await flattenAndPrefixFiles(zipDir, targetPath);
    await fse.remove(zipPath)
    await fse.remove(zipDir);
  } catch(e) {
    console.log('unzip failed', e)
    throw e;
  }
}

export async function flattenAndPrefixFiles(sourceDir, targetDir) {
  const entries = await fse.readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(sourceDir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await fse.readdir(fullPath);
      for (const file of subFiles) {
        const oldPath = path.join(fullPath, file);
        const prefixedName = `${entry.name}_${file}`;
        const newPath = path.join(targetDir, prefixedName);
        await fse.move(oldPath, newPath);
      }
      await fse.remove(fullPath); // remove now-empty folder
    } else {
      const newPath = path.join(targetDir, entry.name);
      await fse.move(fullPath, newPath);
    }
  }
}