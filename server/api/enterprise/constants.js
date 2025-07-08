import { checkPdfEditForge } from "../../handlers/checkPdfEditForge.js";
import { copyMoveForge } from "../../handlers/copyMoveForge.js";
import { checkDuplicate } from "../../handlers/duplicate.js";
import { checkImageTempering } from "../../handlers/imageTempering.js";
import { metadataCheck } from "../../handlers/metadataCheck.js";
import { qrCodeCheck } from "../../handlers/qrCodeReader.js";

export const checksMappingWithPythonFile = {
  duplicate: "de-duplication.py",
  pdfEditForge: "pdf-edit-forgery.py",
  metadataChk: "metadata-check.py",
  tamper: "image-tempering.py",
  copyMoveForge: "copy-move-forgery.py",
  qrCode: "qr-code.py",
};


export const checkHandlers =  {
  'duplicate': (requestId) => checkDuplicate,
  'pdfEditForge': (requestId) => checkPdfEditForge,
  'metadataChk': (requestId) => metadataCheck,
  'tamper': (requestId) => checkImageTempering,
  'copyMoveForge': (requestId) => copyMoveForge,
  'qrCode': (requestId) => qrCodeCheck,
}