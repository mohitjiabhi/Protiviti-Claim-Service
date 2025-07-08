import express from 'express';
import { handleExecuteChecks, handleUploadChunk } from "./enterprise.controller.js";
const router = express.Router();

router.post('/upload-chunk', handleUploadChunk);

router.post('/process', handleExecuteChecks);

export default router;