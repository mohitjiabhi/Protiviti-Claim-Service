const DocPreviewModal = ({ isOpen, onClose, fileUrl }) => {
  if (!isOpen) return null;
  function getFileExtension(filename) {
    return filename.split(".").pop();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-4 rounded-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <div className="mt-8">
          {getFileExtension(fileUrl) === "pdf" ? (
            <iframe
              src={fileUrl}
              className="w-full h-[500px]"
              title="PDF Preview"
            ></iframe>
          ) : (
            <img
              src={fileUrl}
              alt="Document Preview"
              className="w-full h-auto rounded-md"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocPreviewModal;
