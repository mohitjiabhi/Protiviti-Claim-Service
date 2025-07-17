import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

const UploadArea = ({
  uploadIcon,
  infoIcon,
  greenTickIcon,
  info,
  setInfo,
  progress,
  alpha,
  handleFileChange,
  handleDrop,
  consentChecked,
  uploadFailed = false, // Indicates upload failure
  onUploadAttempt,
}) => (
  <div
    className="row-span-5 w-full box-border bg-white rounded-[10px] border-2 border-dashed border-[#012386] flex flex-col items-center justify-center relative"
    onDrop={(e) => {
      if (!consentChecked) onUploadAttempt();
      handleDrop(e);
    }}
    onDragOver={(e) => e.preventDefault()}
    onClick={() => !consentChecked && onUploadAttempt()} // Trigger on click (e.g., Browse label click)
  >
    <img className="w-12 h-12" alt="Cloud upload outline" src={uploadIcon} />
    <div className="text-xs text-gray-400 tracking-[0.50px] leading-[21px] box-border">
      Drag and Drop files or{" "}
      <label className="text-[#012386] cursor-pointer">
        Browse
        {consentChecked ? (
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.zip"
          />
        ) : null}
      </label>
    </div>
    <div className="absolute left-2 bottom-2">
      <div className="w-5 h-5 bg-[#ececec] rounded-[80px] flex items-center justify-center">
        <img
          className="w-5 h-5"
          alt="Information variant"
          src={infoIcon}
          onMouseEnter={() => setInfo(true)}
          onMouseLeave={() => setInfo(false)}
        />
      </div>
      {info && (
        <div className="absolute left-8 bottom-0 w-60 bg-white rounded-[10px] shadow-[0px_2px_14px_4px_#00000014] px-1">
          <div className="text-[10px] text-[#626262] tracking-[0.50px] leading-[21px] text-left">
            Supported file types: JPG, JPEG, PNG, PDF
          </div>
          <div className="text-[10px] text-[#626262] tracking-[0.50px] leading-[21px]">
            <span className="font-medium">Max file size: </span>
            <span className="font-semibold">5 MB</span>
          </div>
          <div className="text-[10px] text-[#626262] tracking-[0.50px] leading-[21px]">
            <span className="font-medium">Max total file size: </span>
            <span className="font-semibold">250 MB</span>
          </div>
        </div>
      )}
    </div>
    <div className="absolute w-8 h-8 right-1 bottom-1">
      <CircularProgressbarWithChildren
        value={uploadFailed ? 0 : progress} // Reset to 0 on failure
        strokeWidth="14"
        text={
          uploadFailed ? "X" : progress === 100 ? "" : `${progress}%` // Only show percentage during progress
        }
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: "butt",
          textSize: "25px",
          pathTransitionDuration: 0.5,
          pathColor: uploadFailed ? "red" : alpha(progress),
          trailColor: uploadFailed ? "#e0e0e0" : "#d6d6d6", // Dull trail on failure
        })}
      >
        {!uploadFailed && progress === 100 && (
          <img src={greenTickIcon} alt="tick" width="15" />
        )}{" "}
        {/* Show tick only on success */}
      </CircularProgressbarWithChildren>
    </div>
  </div>
);

export default UploadArea;
