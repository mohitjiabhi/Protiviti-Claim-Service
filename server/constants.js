import path from 'path'
import fs from 'fs'
export const UPLOAD_ROOT_DIR = path.join(process.cwd(), "uploads");
export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}