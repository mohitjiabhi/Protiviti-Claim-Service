import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";
import formidable from "formidable";
import {
  UPLOAD_ROOT_DIR,
  ensureDirectoryExists,
} from "../../constants.js";
import { isZipFile, unzip } from "../../utils/zip.js";
import { mergeChunk } from "../../utils/chunk.js";
import {checkHandlers} from './constants.js'
// Constants
const CURRENT_DATA_DIR = "current_data";
const fse = fsExtra;

// Field names
const FIELD_CHUNK = "chunk";
const FIELD_UPLOAD_ID = "uploadId";
const FIELD_INDEX = "index";
const FIELD_FILE_NAME = "fileName";
const FIELD_TOTAL_CHUNKS = "totalChunks";
const FIELD_REQUEST_ID = "requestId";

// Ensure root upload directory exists
ensureDirectoryExists(UPLOAD_ROOT_DIR);

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

    // save chunk to disk on this path
    const chunkDir = path.join(UPLOAD_ROOT_DIR, requestId, uploadId);
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
        await handleMergeChunk(uploadId, requestId, fileName, totalChunks, res);
        return;
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
    res.status(200).send({output: 'done'})
  } catch (err) {
    console.error("Error merging chunks:", err);
    await fse.remove(requestDir);
    res.status(400).json({output: err.message})
  }
}

export async function handleExecuteChecks(req, res) {
  const { requestId } = req.body;
  if (!requestId) {
    return res.status(400).send("Missing requestId");
  }
  const promises = [];
  const keys = Object.keys(req.body.checks);
  keys.forEach((key) => promises.push(checkHandlers[key]));
  await Promise.all(promises);
  res.status(200).send("Check processing completed");
}
