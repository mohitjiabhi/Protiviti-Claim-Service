import React, { useState } from "react";

const CheckItem = ({ check, onCheckChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={check.checked}
      onChange={() => onCheckChange(check.id)}
      className="w-4 h-4 text-[#012386] border-gray-300 rounded focus:ring-[#012386]"
    />
    <span className="ml-2 text-sm text-gray-600">{check.title}</span>
  </div>
);

const BulkUploadModal = ({
  isOpen,
  onClose,
  onFileSelect,
  onChecksSubmit,
  analyticalChecks,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedChecks, setSelectedChecks] = useState(
    analyticalChecks.map((check) => ({
      ...check,
      checked: check.checked,
      description: check.description.split(" ").slice(0, 5).join(" ") + "...",
    }))
  );
  const [message, setMessage] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    onFileSelect(files);
  };

  const handleCheckChange = (id) => {
    setSelectedChecks((prev) =>
      prev.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );
  };

  const handleSubmit = () => {
    onChecksSubmit(selectedChecks.filter((check) => check.checked));
    // onClose();
    setMessage(true);
  };
  const handleModal = () => {
    setMessage(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {!message ? (
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            You have selected bulk upload functionality
          </h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Select files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Select Analytical Checks
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {selectedChecks.map((check) => (
                  <CheckItem
                    key={check.id}
                    check={check}
                    onCheckChange={handleCheckChange}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={selectedFiles.length > 0 ? handleSubmit : onClose}
              className="px-4 py-2 bg-[#012386] text-white text-sm rounded hover:bg-[#011d6b]"
            >
              {selectedFiles.length > 0 ? "Submit" : "OK"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-md text-center font-semibold text-gray-800 mb-4 h-full">
            Thanks for submitting the request, your results will be sent to your
            mail once generated!!
          </h2>

          <div className="flex justify-center gap-2">
            <button
              onClick={handleModal}
              className="px-4 py-2 bg-[#012386] text-white text-sm rounded hover:bg-[#011d6b]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadModal;
