import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 1 MB
  const [files, setFiles] = useState([]);
  const [fileFields, setFileFields] = useState({}); // { fileName: fieldName }
  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [output, setOutput] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Initialize field name entries
    const initialFields = {};
    selectedFiles.forEach((file) => {
      initialFields[file.name] = "";
    });
    setFileFields(initialFields);
  };

  const uploadFileInChunks = async (requestId, file) => {
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
      formData.append("fieldName", fileFields[file.name] || "");
      console.log(index, totalChunks);
      if (index === totalChunks - 1) {
        formData.append("totalChunks", totalChunks);
      }
      await axios.post(
        "http://localhost:5000/enterprise/upload-chunk",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update per-file progress
      setProgress((prev) => ({
        ...prev,
        [file.name]: Math.round(((index + 1) / totalChunks) * 100),
      }));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select at least one file");

    setUploading(true);
    setProgress({});

    try {
      const requestId = Date.now();
      const uploadMap = files.map(async (file) => {
        await uploadFileInChunks(requestId, file);
      });
      await Promise.all(uploadMap);
      const response = await axios.post(
        "http://localhost:5000/enterprise/process",
        {
          "requestId": requestId,
          "checkDuplicate": true,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setOutput(JSON.stringify(response?.data?.output))
    } catch (err) {
      console.error("Upload error", err);
      setOutput('Failed !!!')
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
          <div key={file.name} style={{ marginBottom: 20 }}>
            <strong>{file.name}</strong>

            <input
              type="text"
              placeholder="Field Name"
              value={fileFields[file.name] || ""}
              onChange={(e) =>
                setFileFields({ ...fileFields, [file.name]: e.target.value })
              }
              style={{
                display: "block",
                width: "100%",
                marginTop: 5,
                padding: 8,
              }}
              disabled={uploading}
            />

            <progress
              value={progress[file.name] || 0}
              max="100"
              style={{ width: "100%", marginTop: 5 }}
            />
            <p>{progress[file.name] || 0}%</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: uploading ? "not-allowed" : "pointer",
        }}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <span>{output}</span>
    </div>
  );
}

export default App;
