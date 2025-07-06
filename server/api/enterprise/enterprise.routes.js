import express from 'express';
import { handleProcessCheck, handleUploadChunk } from "./enterprise.controller.js";
const router = express.Router();

router.post('/upload-chunk', handleUploadChunk);

router.post('/process', handleProcessCheck);

export default router;