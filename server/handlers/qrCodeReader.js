import path from "path";
import {UPLOAD_ROOT_DIR, ensureDirectoryExists} from '../constants.js'
import axios from 'axios'
const name = 'QR Code Reader'
const folders = ["Input Files", "Image Files", "Excel Files"]

export async function qrCodeCheck(requestId, res) {
  const metadata = {};
  const requestIdPath = path.join(UPLOAD_ROOT_DIR, requestId?.toString());
  metadata.current_folder = path.resolve(path.join(requestIdPath, "current_data"));
  for (const folderName of folders) {
    const destDir = path.join(
      requestIdPath,
      name,
      folderName
    );
    ensureDirectoryExists(destDir);
    if (folderName === "Input Files") {
      metadata.input_folder = path.resolve(destDir);
    }
    if (folderName === "Excel Files") {
      metadata.output_excel = path.resolve(destDir);
      // Handle excel files if needed
    }
    if (folderName == "Image Files") {
      metadata.image_folder = path.resolve(destDir);
      // Handle image files if needed
    }
  }
  console.log(`Metadata for request ${requestId}: checkDuplicate`, metadata);
  metadata["poppler_path"] = path.join(
    process.cwd(),
    "scripts",
    "poppler-24.02.0",
    "Library",
    "bin"
  );
  const metadataJson = JSON.stringify({ paths: metadata });
  const baseString = Buffer.from(metadataJson).toString("base64");
  console.log(baseString)
  axios.post("http://qr-code-forge:8000/check-forge", {content: baseString}).catch(e => console.log(e));
}