import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [output, setOutput] = useState("");

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    setFiles(selectedFiles);

    // Set default field names
    const fields = {};
    selectedFiles.forEach((file) => {
      fields[file.name] = "";
    });
    // Start upload
    await startUpload(selectedFiles, fields);
  };

  const startUpload = async (selectedFiles, fields) => {
    setUploading(true);
    setProgress(0);
    setOutput("");

    try {
      const requestId = Date.now();
      let totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      let uploadedBytes = 0;

      for (const file of selectedFiles) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = `${file.name}-${Date.now()}`;

        for (let index = 0; index < totalChunks; index++) {
          const start = index * CHUNK_SIZE;
          const end = Math.min(file.size, start + CHUNK_SIZE);
          const chunk = file.slice(start, end);

          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("index", index);
          formData.append("uploadId", uploadId);
          formData.append("fileName", file.name);
          formData.append("requestId", requestId);

          if (index === totalChunks - 1) {
            formData.append("totalChunks", totalChunks);
          }

          await axios.post("http://localhost:5001/enterprise/upload-chunk", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          uploadedBytes += chunk.size;
          setProgress(Math.round((uploadedBytes / totalBytes) * 100));
        }
      }

      const response = await axios.post(
        "http://localhost:5001/enterprise/process",
        {
          requestId,
          checks: {
            duplicate: true,
            pdfEditForge: true,
            metadataCheck: true,
            tamper: true,
            copyMoveForge: true,
            qrCode: true
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setOutput(JSON.stringify(response?.data?.message || "Done"));
    } catch (err) {
      const message =  err?.response?.data?.message || 'failed';
      setOutput(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Chunked Multiple File Upload</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
      />

      <div style={{ marginTop: 20 }}>
        {files.map((file) => (
          <div key={file.name} style={{ marginBottom: 10 }}>
            <strong>{file.name}</strong>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <>
          <progress
            value={progress}
            max="100"
            style={{ width: "100%", marginTop: 20 }}
          />
          <p>{progress}%</p>
        </>
      )}

      {output && <p style={{ marginTop: 20 }}>{output}</p>}
    </div>
  );
}

export default App;
