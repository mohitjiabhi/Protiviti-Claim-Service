import { checksMappingWithPythonFile } from "../api/enterprise/constants.js";
import path from "path";
import {UPLOAD_ROOT_DIR, ensureDirectoryExists} from '../constants.js'
import { runPythonScript } from "./runPython.js";
const name = 'Copy Move Forge'
const folders = ["Input Files", "Image Files", "Excel Files"]
export async function copyMoveForge(requestId, res) {
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
  console.log(`Metadata for request ${requestId}: copyMoveForge`, metadata);
  const pythonExec = path.join(
    process.cwd(),
    "scripts",
    "venv",
    "bin",
    "python"
  ); // Update path for Windows if needed
  const scriptPath = path.join(process.cwd(), "scripts", checksMappingWithPythonFile.copyMoveForge);
  metadata["poppler_path"] = path.join(
    process.cwd(),
    "scripts",
    "poppler-24.02.0",
    "Library",
    "bin"
  );
  const metadataJson = JSON.stringify({ paths: metadata });
  const baseString = Buffer.from(metadataJson).toString("base64");

  const result = await runPythonScript(pythonExec, scriptPath, baseString);
  console.log('python script output:', result)
  return result;
}