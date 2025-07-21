import React, { useState, forwardRef, useEffect, useRef } from "react";
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
import { getSession } from "../utils/session";

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
    const MAX_TOTAL_SIZE = 250 * 1024 * 1024; // 250 MB total for normal upload
    const BULK_MAX_TOTAL_SIZE = 2048 * 1024 * 1024; // 2 GB for bulk upload
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
    const [randomNumber, setRandomNumber] = useState(
      getRandomInt(1000, 1000000).toString()
    );
    const [requestId, setRequestId] = useState(`${randomNumber}_${Date.now()}`);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadFailed, setUploadFailed] = useState(false); // Track upload failure
    const [consentWarning, setConsentWarning] = useState(false); // Track consent warning state
    const [isUploadComplete, setIsUploadComplete] = useState(false); // Track upload completion
    const fileInputRef = useRef(null); // Ref to reset file input

    // Sync local state with prop callback
    React.useEffect(() => {
      setUploadStatus(uploadStatus);
    }, [uploadStatus, setUploadStatus]);

    // Check session validity
    // useEffect(() => {
    //   const session = getSession();
    //   if (!session) {
    //     setLocalUploadStatus("Session expired. Please restart the session.");
    //     setMessage("Session expired. Please restart the session.");
    //     setShowMessageModal(true);
    //   }
    // }, []);

    React.useImperativeHandle(ref, () => ({
      handleProcessChecks,
      setUploadStatus: setLocalUploadStatus,
      requestId,
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

    const handleRequestId = () => {
      const newRequestId = `${randomNumber}_${Date.now()}`;
      setRequestId(newRequestId);
      console.log("New Request ID:", newRequestId);
      return newRequestId;
    };

    const handleBulkModal = () => {
      const newRequestId = handleRequestId();
      if (!consentChecked) {
        setConsentWarning(true);
        return;
      }
      // Reset form data when modal is reopened
      setFiles([]);
      setProgress(0);
      setUploadFailed(false);
      setIsUploadComplete(false);
      setLocalUploadStatus("");
      setUploadStats([
        { label: "No of Files Uploaded", value: "0" },
        { label: "Size of File Uploaded", value: "0 MB" },
      ]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsModalOpen(true);
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

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const handleUploadChunk = async (
      file,
      chunk,
      index,
      totalChunks,
      uploadId,
      requestId
    ) => {
      const session = getSession();
      // if (!session) {
      //   throw new Error("Session expired during upload.");
      // }

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("index", index.toString());
      formData.append("uploadId", uploadId);
      formData.append("fileName", file.name);
      formData.append("requestId", requestId);
      formData.append("session", JSON.stringify(session));

      if (index === totalChunks - 1) {
        formData.append("totalChunks", totalChunks.toString());
      }
      try {
        const response = await axios.post(
          "http://localhost:5001/enterprise/upload-chunk",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
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

        if (index + 1 === totalChunks && response.status === 200) {
          setLocalUploadStatus("Files uploaded successfully.");
          setMessage("Files uploaded successfully.");
          setShowMessageModal(true);
          setUploadComplete(true);
          setUploadFailed(false);
          setIsUploadComplete(true); // Mark upload as complete
        }
        return response;
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Unknown server error";
        setLocalUploadStatus(`Upload failed: ${errorMessage}`);
        setMessage(`Upload failed: ${errorMessage}`);
        setShowMessageModal(true);
        setProgress(0);
        setUploadFailed(true);
        console.error("API Error:", error);
      }
    };

    const startUpload = async (selectedFiles, requestId) => {
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
            uploadId,
            requestId
          );
          uploadedBytes += chunks[index].size;
          const overallProgress = Math.round(
            (uploadedBytes / totalBytes) * 100
          );
          setProgress(overallProgress);
        }
      }
      if (!uploadFailed) {
        updateStats(selectedFiles);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleFileChange = async (e) => {
      const newRequestId = handleRequestId();
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length === 0) {
        setLocalUploadStatus("Please select files to upload.");
        setMessage("Please select files to upload.");
        setShowMessageModal(true);
        return;
      }

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
      handleChecksDisplay(true);
      await startUpload(selectedFiles, newRequestId);
    };

    const handleDrop = async (e) => {
      const newRequestId = handleRequestId();
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length === 0) {
        setLocalUploadStatus("Please drop files to upload.");
        setMessage("Please drop files to upload.");
        setShowMessageModal(true);
        return;
      }

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
      handleChecksDisplay(true);
      await startUpload(droppedFiles, newRequestId);
    };

    const handleModalFileSelect = async (selectedFiles) => {
      const newRequestId = handleRequestId();
      if (selectedFiles.length === 0) return;

      const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > BULK_MAX_TOTAL_SIZE) {
        setMessage("Total upload size exceeds 2 GB limit.");
        setFiles([]);
        setProgress(0);
        return;
      }

      setFiles(selectedFiles);
      handleChecksDisplay(true);
      // await startUpload(selectedFiles, newRequestId);
    };

    const handleProcessChecks = async (selectedChecks) => {
      const newRequestId = handleRequestId();
      if (selectedChecks.length === 0) {
        setLocalUploadStatus("No checks selected for processing.");
        setMessage("No checks selected for processing.");
        setShowMessageModal(true);
        return;
      }

      const session = getSession();
      // if (!session) {
      //   setLocalUploadStatus("Session expired. Please restart the session.");
      //   setMessage("Session expired. Please restart the session.");
      //   setShowMessageModal(true);
      //   return;
      // }

      const payload = {
        requestId: newRequestId,
        checks: selectedChecks,
      };

      try {
        const response = await axios.post(
          "http://localhost:5001/enterprise/bulk-upload-process",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Bulk process response:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Bulk process error:",
          error.response ? error.response.data : error.message
        );
        throw new Error(
          error.response?.data?.error ||
            "Failed to process checks: Server error"
        );
      }
    };
    const handleRefresh = () => {
      setFiles([]);
      setProgress(0);
      setUploadFailed(false);
      setIsUploadComplete(false);
      setLocalUploadStatus("");
      setUploadStats([
        { label: "No of Files Uploaded", value: "0" },
        { label: "Size of File Uploaded", value: "0 MB" },
      ]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploadComplete(false); // Reset parent state
    };

    return (
      <section
        className={`col-span-1 md:col-span-4 relative w-full h-full bg-white border border-[#e6e9eb] shadow-sm rounded-lg box-border p-6 grid gap-2 md:gap-0 ${wrapperClassName}`}
      >
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
          uploadFailed={uploadFailed}
          onUploadAttempt={() => !consentChecked && setConsentWarning(true)}
          handleRequestId={handleRequestId}
          fileInputRef={fileInputRef}
          isUploadComplete={isUploadComplete}
          onRefresh={handleRefresh}
        />
        <div className="grid items-center">
          <UploadStats uploadStats={uploadStats} uploadStatus={uploadStatus} />
        </div>
        <ConsentCheckbox
          checked={consentChecked}
          onChange={setConsentChecked}
          consentWarning={consentWarning}
          onConsentChange={() => setConsentWarning(false)}
        />
        <div className="flex flex-row justify-between items-center">
          <div className="text-xs w-4/6">
            Please upload here if file size is more than 250MB
          </div>
          <button
            onClick={handleBulkModal}
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
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
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
          randomNumber={randomNumber}
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
