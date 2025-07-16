import path from "path";
import fsExtra from "fs-extra";
import { UPLOAD_ROOT_DIR, ensureDirectoryExists } from "../../constants.js";
import { isZipFile, unzip } from "../../utils/zip.js";
import {
  mergeChunk,
  normalizeFormidableFields,
  parseForm,
  uploadChunk,
} from "../../utils/upload.js";
import { checkHandlers } from "./constants.js";
import db from "../../configs/db/index.js";
// Constants
const CURRENT_DATA_DIR = "current_data";
const fse = fsExtra;

// Ensure root upload directory exists
ensureDirectoryExists(UPLOAD_ROOT_DIR);

// Handle chunk upload
export async function handleUploadChunk(req, res) {
  try {
    // Field names
    const FIELD_CHUNK = "chunk";
    const FIELD_UPLOAD_ID = "uploadId";
    const FIELD_INDEX = "index";
    const FIELD_FILE_NAME = "fileName";
    const FIELD_TOTAL_CHUNKS = "totalChunks";
    const FIELD_REQUEST_ID = "requestId";
    const { fields, files } = await parseForm(req);
    const fieldNormalize = normalizeFormidableFields(fields, [
      FIELD_UPLOAD_ID,
      FIELD_INDEX,
      FIELD_FILE_NAME,
      FIELD_TOTAL_CHUNKS,
      FIELD_REQUEST_ID,
    ]);
    const fileNormalize = normalizeFormidableFields(files, [FIELD_CHUNK]);
    const normalize = { ...fieldNormalize, ...fileNormalize };

    if (!normalize.uploadId || !normalize.index || !normalize.chunk) {
      return res.status(400).send("Missing required fields");
    }
    await uploadChunk(
      UPLOAD_ROOT_DIR,
      normalize.requestId,
      normalize.uploadId,
      normalize.chunk,
      normalize.index
    );
    if (normalize.totalChunks) {
      await handleMergeChunk(
        normalize.uploadId,
        normalize.requestId,
        normalize.fileName,
        normalize.totalChunks
      );
    }
    res.status(200).send({ status: true, message: "done", data: {} });
  } catch (e) {
    res.status(400).send({ status: false, message: e.message, data: null });
  }
}

// Merge all uploaded chunks into a final file
export async function handleMergeChunk(
  uploadId,
  requestId,
  fileName,
  totalChunks
) {
  if (!uploadId || !fileName || !totalChunks) {
    return res.status(400).send("Missing required fields");
  }

  const chunkDir = path.join(UPLOAD_ROOT_DIR, requestId, uploadId);
  const outputDir = path.join(UPLOAD_ROOT_DIR, requestId, CURRENT_DATA_DIR);
  const requestDir = path.join(UPLOAD_ROOT_DIR, requestId);
  const finalFilePath = path.join(outputDir, fileName);
  await fse.ensureDir(outputDir);
  try {
    // handle chunk
    await mergeChunk(chunkDir, outputDir, fileName);
    // zip process if file is zip
    const isZip = await isZipFile(finalFilePath);
    if (isZip) {
      console.log("Detected ZIP. Processing...");
      await unzip(finalFilePath, outputDir);
    }
  } catch (err) {
    console.error("Error merging chunks:", err);
    await fse.remove(requestDir);
    throw err;
  }
}

export async function handleExecuteChecks(req, res) {
  const { requestId } = req.body;
  if (!requestId) {
    return res.status(400).send("Missing requestId");
  }
  await db.query(
    "INSERT INTO transaction_status (employee_id, session_id, process_timestamp, status) VALUES (?, ?, ?, ?)",
    [1, requestId, new Date(), "pending"]
  );
  const promises = [];
  const keys = Object.keys(req.body.checks);
  console.log(keys)
  keys.forEach((key) => promises.push(checkHandlers[key](requestId)));
  await Promise.all(promises);
  res.status(200).send("Check processing completed");
}
