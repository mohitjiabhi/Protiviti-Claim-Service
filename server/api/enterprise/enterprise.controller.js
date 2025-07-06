import path from "path";
import fs from "fs";
import formidable from "formidable";
import { spawn } from "child_process";
// Constants
const UPLOAD_ROOT_DIR = path.join(process.cwd(), "uploads");
const CURRENT_DATA_DIR = "current_data";

// Field names
const FIELD_CHUNK = "chunk";
const FIELD_UPLOAD_ID = "uploadId";
const FIELD_INDEX = "index";
const FIELD_FIELD_NAME = "fieldName";
const FIELD_FILE_NAME = "fileName";
const FIELD_TOTAL_CHUNKS = "totalChunks";
const FIELD_REQUEST_ID = "requestId";

const checksMapping = {
  checkDuplicate: {
    name: "Duplicate Forgery",
    dirMapping: ["Input Files", "Image Files", "Excel Files"],
  },
};

// Ensure root upload directory exists
if (!fs.existsSync(UPLOAD_ROOT_DIR)) {
  fs.mkdirSync(UPLOAD_ROOT_DIR, { recursive: true });
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Handle chunk upload
export async function handleUploadChunk(req, res) {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).send("Error parsing the files");
    }

    let uploadId = fields[FIELD_UPLOAD_ID];
    let index = fields[FIELD_INDEX];
    let chunk = files[FIELD_CHUNK];

    // Normalize single values from arrays
    if (Array.isArray(chunk)) chunk = chunk[0];
    if (Array.isArray(uploadId)) uploadId = uploadId[0];
    if (Array.isArray(index)) index = index[0];

    const fieldName = Array.isArray(fields[FIELD_FIELD_NAME])
      ? fields[FIELD_FIELD_NAME][0]
      : fields[FIELD_FIELD_NAME];
    const fileName = Array.isArray(fields[FIELD_FILE_NAME])
      ? fields[FIELD_FILE_NAME][0]
      : fields[FIELD_FILE_NAME];
    const totalChunks = Array.isArray(fields[FIELD_TOTAL_CHUNKS])
      ? Number(fields[FIELD_TOTAL_CHUNKS][0])
      : null;
    const requestId = Array.isArray(fields[FIELD_REQUEST_ID])
      ? fields[FIELD_REQUEST_ID][0]
      : fields[FIELD_REQUEST_ID];

    if (!uploadId || !index || !chunk) {
      return res.status(400).send("Missing required fields");
    }
    const uploadIdWithFieldName = `${fieldName}_${uploadId}`;
    // save chunk to disk on this path
    const chunkDir = path.join(
      UPLOAD_ROOT_DIR,
      requestId,
      uploadIdWithFieldName
    );
    ensureDirectoryExists(chunkDir);

    const chunkPath = path.join(chunkDir, index);

    // rename the uploaded file to the chunk path
    fs.rename(chunk.filepath, chunkPath, async (err) => {
      if (err) {
        console.error("Error saving chunk:", err);
        return res.status(500).send("Error saving chunk");
      }

      // If it's the last chunk, trigger merging
      if (totalChunks) {
        await handleMergeChunk(
          uploadIdWithFieldName,
          requestId,
          `${fieldName}_${fileName}`,
          totalChunks,
          res
        );
      }

      res.status(200).send("Chunk uploaded");
    });
  });
}

// Merge all uploaded chunks into a final file
export async function handleMergeChunk(
  uploadId,
  requestId,
  fileName,
  totalChunks,
  res
) {
  if (!uploadId || !fileName || !totalChunks) {
    return res.status(400).send("Missing required fields");
  }

  const chunkDir = path.join(UPLOAD_ROOT_DIR, requestId, uploadId);
  const outputDir = path.join(UPLOAD_ROOT_DIR, requestId, CURRENT_DATA_DIR);
  const finalFilePath = path.join(outputDir, fileName);

  ensureDirectoryExists(outputDir);

  try {
    const writeStream = fs.createWriteStream(finalFilePath);
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, String(i));
      if (!fs.existsSync(chunkPath)) {
        return res.status(400).send(`Chunk ${i} is missing`);
      }
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
    }

    writeStream.end();
    writeStream.on("finish", () => {
      fs.rmSync(chunkDir, { recursive: true, force: true });
    });
    writeStream.on("error", (err) => {
      console.error("Merge write stream error:", err);
    });
  } catch (err) {
    console.error("Error merging chunks:", err);
  }
}

// Placeholder for process check
export async function handleProcessCheck(req, res) {
  const { requestId, checkDuplicate } = req.body;
  if (!requestId) {
    return res.status(400).send("Missing requestId");
  }
  if (checkDuplicate) {
    const result = await runCheckDuplicate(requestId);
    res.status(200).json(result);
    return;
  }
  res.status(200).send("Check processing completed");
  // Implement logic here if needed
}

export async function runCheckDuplicate(requestId, res) {
  const metadata = {};
  const requestIdPath = path.join(UPLOAD_ROOT_DIR, requestId?.toString());
  metadata.current_folder = path.resolve(path.join(requestIdPath, "current_data"));
  const folders = checksMapping.checkDuplicate.dirMapping;
  for (const folderName of folders) {
    const destDir = path.join(
      requestIdPath,
      checksMapping.checkDuplicate.name,
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
  const pythonExec = path.join(
    process.cwd(),
    "scripts",
    "venv",
    "bin",
    "python"
  ); // Update path for Windows if needed
  const scriptPath = path.join(process.cwd(), "scripts", "duplicate_code.py");
  metadata["poppler_path"] = path.join(
    process.cwd(),
    "scripts",
    "poppler-24.02.0",
    "Library",
    "bin"
  );
  const metadataJson = JSON.stringify({ paths: metadata });
  const baseString = Buffer.from(metadataJson).toString("base64");
  console.log(metadataJson);
  const result = await runPythonScript(pythonExec, scriptPath, baseString);
  console.log('python script output:', result)
  return result;
}

function runPythonScript(pythonExec, scriptPath, baseString) {
  console.log(baseString);
  return new Promise((resolve, reject) => {
    const proc = spawn(pythonExec, [scriptPath, baseString], {
      cwd: process.cwd(),
    });

    let responded = false;

    proc.stdout.on("data", (data) => {
      if (!responded) {
        responded = true;
        resolve({ success: true, output: data.toString() });
      }
    });

    proc.stderr.on("data", (data) => {
      if (!responded) {
        responded = true;
        reject({ success: false, error: data.toString() });
      }
    });

    proc.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  });
}
