import React, { useState, forwardRef } from "react";
import axios from "axios";
import BulkUploadModal from "./Modals/BulkUploadModal";
import UploadArea from "./Upload/UploadArea";
import UploadStats from "./Upload/UploadStats";
import ConsentCheckbox from "./Upload/ConsentCheckbox";
import MetadataOptions from "./Upload/MetadataOptions";
import FileUploadButton from "./Upload/FileUploadButton";
import FieldSelector from "./Upload/FieldSelector";
import UploadMessageModal from "./Modals/UploadMessageModal";
import uploadIcon from "../../assets/upload-icons/upload-icon.svg";
import infoIcon from "../../assets/upload-icons/info-icon.svg";
import greenTickIcon from "../../assets/upload-icons/green-tick-icon.svg";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UploadSection = forwardRef(
  (
    {
      analyticalChecks,
      handleChecksDisplay,
      setUploadComplete,
      setUploadStatus,
      wrapperClassName = "",
    },
    ref
  ) => {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
    const MAX_INDIVIDUAL_SIZE = 5 * 1024 * 1024; // 5 MB per file (except .zip)
    const MAX_TOTAL_SIZE = 250 * 1024 * 1024; // 250 MB total
    const [consentChecked, setConsentChecked] = useState(false);
    const [metadataOption, setMetadataOption] = useState("no");
    const [info, setInfo] = useState(false);
    const [info2, setInfo2] = useState(false);
    const [claimNumber, setClaimNumber] = useState("001");
    const [files, setFiles] = useState([]);
    const [uploadStatus, setLocalUploadStatus] = useState(""); // Local state for uploadStatus
    const [progress, setProgress] = useState(0);
    const [uploadStats, setUploadStats] = useState([
      { label: "No of Files Uploaded", value: "0" },
      { label: "Size of File Uploaded", value: "0 MB" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestId, setRequestId] = useState(Date.now().toString()); // Unique request ID
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadFailed, setUploadFailed] = useState(false); // Track upload failure
    const [consentWarning, setConsentWarning] = useState(false); // Track consent warning state

    // Sync local state with prop callback
    React.useEffect(() => {
      setUploadStatus(uploadStatus);
    }, [uploadStatus, setUploadStatus]);

    React.useImperativeHandle(ref, () => ({
      handleProcessChecks,
      setUploadStatus: setLocalUploadStatus, // Expose setUploadStatus for ref
    }));

    const alpha = (Desiredpercentage) => {
      if (Desiredpercentage >= 0 && Desiredpercentage <= 33) return "red";
      if (Desiredpercentage > 33 && Desiredpercentage <= 66) return "yellow";
      return "#1BE57D";
    };

    const updateStats = (selectedFiles) => {
      const fileCount = selectedFiles.length;
      const totalSize =
        selectedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
      setUploadStats([
        { label: "No of Files Uploaded", value: fileCount.toString() },
        { label: "Size of File Uploaded", value: totalSize.toFixed(2) + " MB" },
      ]);
    };

    const chunkFile = (file) => {
      const chunks = [];
      let start = 0;
      while (start < file.size) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        chunks.push(file.slice(start, end));
        start = end;
      }
      return chunks;
    };

    const handleUploadChunk = async (
      file,
      chunk,
      index,
      totalChunks,
      uploadId
    ) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("index", index.toString());
      formData.append("uploadId", uploadId);
      formData.append("fileName", file.name);
      formData.append("requestId", requestId);
      if (index === totalChunks - 1) {
        formData.append("totalChunks", totalChunks.toString());
      }

      try {
        await axios.post(
          `http://localhost:5001/enterprise/upload-chunk`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const uploadedBytes = index * CHUNK_SIZE + progressEvent.loaded;
              const totalBytes = file.size;
              const percentCompleted = Math.round(
                (uploadedBytes / totalBytes) * 100
              );
              setProgress(percentCompleted);
            },
          }
        );
        if (index + 1 === totalChunks) {
          setLocalUploadStatus("Files uploaded successfully.");
          setMessage("Files uploaded successfully.");
          setShowMessageModal(true);
          setUploadComplete(true);
          setUploadFailed(false); // Reset failure on success
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Unknown server error";
        setLocalUploadStatus(`Upload failed: ${errorMessage}`);
        setMessage(`Upload failed: ${errorMessage}`);
        setShowMessageModal(true);
        setProgress(0);
        setUploadFailed(true); // Set failure state on error
        console.error("API Error:", error);
      }
    };

    const startUpload = async (selectedFiles) => {
      if (!consentChecked) {
        setMessage("Please check the consent to upload the file.");
        setShowMessageModal(true);
        setConsentWarning(true); // Trigger warning
        return;
      }

      setUploadFailed(false); // Reset failure state before upload
      setConsentWarning(false); // Reset warning when consent is provided
      let uploadedBytes = 0;
      const totalBytes = selectedFiles.reduce(
        (sum, file) => sum + file.size,
        0
      );

      for (const file of selectedFiles) {
        const uploadId = `${file.name}-${Date.now()}`;
        const chunks = chunkFile(file);
        const totalChunks = chunks.length;

        for (let index = 0; index < totalChunks; index++) {
          await handleUploadChunk(
            file,
            chunks[index],
            index,
            totalChunks,
            uploadId
          );
          uploadedBytes += chunks[index].size;
          const overallProgress = Math.round(
            (uploadedBytes / totalBytes) * 100
          );
          setProgress(overallProgress);
        }
      }
      // Update stats only after all files are successfully uploaded
      if (!uploadFailed) {
        updateStats(selectedFiles);
      }
    };

    const handleFileChange = async (e) => {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length === 0) {
        setLocalUploadStatus("Please select files to upload.");
        setMessage("Please select files to upload.");
        setShowMessageModal(true);
        return;
      }

      // Check for oversized non-zip files (5 MB limit applies only to non-zip)
      const oversizedFiles = selectedFiles.filter(
        (file) => !file.name.endsWith(".zip") && file.size > MAX_INDIVIDUAL_SIZE
      );
      if (oversizedFiles.length > 0) {
        alert(
          `Error: The following files exceed 5 MB limit: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}. Please select files smaller than 5 MB (except .zip).`
        );
        setFiles([]);
        setProgress(0);
        return;
      }

      // Check total size limit (250 MB for all files)
      const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        alert(
          `Error: Total upload size (${(totalSize / (1024 * 1024)).toFixed(
            2
          )} MB) exceeds 250 MB limit.`
        );
        setFiles([]);
        setProgress(0);
        return;
      }

      setFiles(selectedFiles);
      // Removed updateStats here to prevent premature update
      handleChecksDisplay(true);
      await startUpload(selectedFiles);
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length === 0) {
        setLocalUploadStatus("Please drop files to upload.");
        setMessage("Please drop files to upload.");
        setShowMessageModal(true);
        return;
      }

      // Check for oversized non-zip files (5 MB limit applies only to non-zip)
      const oversizedFiles = droppedFiles.filter(
        (file) => !file.name.endsWith(".zip") && file.size > MAX_INDIVIDUAL_SIZE
      );
      if (oversizedFiles.length > 0) {
        alert(
          `Error: The following files exceed 5 MB limit: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}. Please drop files smaller than 5 MB (except .zip).`
        );
        setFiles([]);
        setProgress(0);
        return;
      }

      // Check total size limit (250 MB for all files)
      const totalSize = droppedFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        alert(
          `Error: Total upload size (${(totalSize / (1024 * 1024)).toFixed(
            2
          )} MB) exceeds 250 MB limit.`
        );
        setFiles([]);
        setProgress(0);
        return;
      }

      setFiles(droppedFiles);
      // Removed updateStats here to prevent premature update
      handleChecksDisplay(true);
      await startUpload(droppedFiles);
    };

    const handleModalFileSelect = (selectedFiles) => {
      setFiles(selectedFiles);
      // Removed updateStats here to prevent premature update
    };

    const handleProcessChecks = async () => {
      const selectedChecks = analyticalChecks.filter((check) => check.checked);
      if (selectedChecks.length === 0) {
        setLocalUploadStatus("No checks selected for processing.");
        setMessage("No checks selected for processing.");
        setShowMessageModal(true);
        return;
      }

      const checksPayload = {
        requestId,
        checks: {
          duplicate: selectedChecks.some((c) => c.id === "deduplication"),
          pdfEditForge: selectedChecks.some((c) => c.id === "pdf-edit"),
          metadataCheck: selectedChecks.some((c) => c.id === "metadata"),
          tamper: selectedChecks.some((c) => c.id === "image-tampering"),
          copyMoveForge: selectedChecks.some((c) => c.id === "copy-move"),
          qrCode: selectedChecks.some((c) => c.id === "qr-code"),
        },
      };

      try {
        setLocalUploadStatus("Results are generating...");
        const response = await axios.post(
          `http://localhost:5001/enterprise/process`,
          checksPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setLocalUploadStatus(
          "Checks processing completed. Results will be emailed."
        );
        setMessage("Checks processing completed. Results will be emailed.");
        setShowMessageModal(true);
        setProgress(100);
        setFiles([]);
        handleChecksDisplay(false);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Unknown server error";
        setLocalUploadStatus(`Check processing failed: ${errorMessage}`);
        setMessage(`Check processing failed: ${errorMessage}`);
        setShowMessageModal(true);
        setProgress(0);
        console.error("API Error:", error);
      }
    };

    return (
      <section className={`relative w-full h-full grid bg-white border border-[#e6e9eb] shadow-lg rounded-lg box-border p-6 gap-2 ${wrapperClassName}`}>
        <UploadArea
          uploadIcon={uploadIcon}
          infoIcon={infoIcon}
          greenTickIcon={greenTickIcon}
          info={info}
          setInfo={setInfo}
          progress={progress}
          alpha={alpha}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          consentChecked={consentChecked}
          uploadFailed={uploadFailed} // Pass the failure state
          onUploadAttempt={() => !consentChecked && setConsentWarning(true)} // Notify upload attempt
        />
        <div className="row-span-1 grid items-center">
          <UploadStats uploadStats={uploadStats} uploadStatus={uploadStatus} />
        </div>
        <ConsentCheckbox
          checked={consentChecked}
          onChange={setConsentChecked}
          consentWarning={consentWarning} // Pass warning state
          onConsentChange={() => setConsentWarning(false)} // Reset warning on consent
        />
        <div className="flex flex-row justify-between items-center">
          <div className="text-xs w-4/6">
            Please upload here if file size is more than 250MB
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-[#012386] text-white rounded-lg font-semibold text-xs"
          >
            Bulk Upload
          </button>
        </div>
        <MetadataOptions
          metadataOption={metadataOption}
          setMetadataOption={setMetadataOption}
        />
        {metadataOption === "yes" && (
          <div className="row-span-1 grid grid-cols-2 md:grid-cols-2 gap-4">
            <FileUploadButton
              info2={info2}
              setInfo2={setInfo2}
              infoIcon={infoIcon}
            />
            <FieldSelector />
          </div>
        )}
        <BulkUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFileSelect={handleModalFileSelect}
          onCheckSubmit={handleProcessChecks}
          analyticalChecks={analyticalChecks}
        />
        <UploadMessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          message={message}
        />
      </section>
    );
  }
);

export default UploadSection;
