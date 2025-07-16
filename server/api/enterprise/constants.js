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
  'duplicate': (requestId) => checkDuplicate(requestId),
  'pdfEditForge': (requestId) => checkPdfEditForge(requestId),
  'metadataCheck': (requestId) => metadataCheck(requestId),
  'tamper': (requestId) => checkImageTempering(requestId),
  'copyMoveForge': (requestId) => copyMoveForge(requestId),
  'qrCode': (requestId) => qrCodeCheck(requestId),
}