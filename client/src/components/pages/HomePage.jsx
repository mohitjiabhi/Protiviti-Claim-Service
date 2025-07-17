import React, { useState, useRef } from "react";
import HeaderSection from "../helper/HeaderSection";
import SideBar from "../helper/SideBar";
import UploadSection from "../helper/UploadSection";
import { Link, useNavigate } from "react-router-dom";
import CheckCard from "../helper/CheckCard";
import initialChecks from "../utils/initialChecks";

// HomePage component
const HomePage = () => {
  const [checks, setChecks] = useState(initialChecks);
  const [selectAll, setSelectAll] = useState(
    initialChecks.every((c) => c.checked)
  );
  const [checksDisplay, setChecksDisplay] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uploadSectionRef = useRef(null);

  const handleToggleCheck = (id) => {
    const updated = checks.map((check) =>
      check.id === id ? { ...check, checked: !check.checked } : check
    );
    setChecks(updated);
    setSelectAll(updated.every((c) => c.checked));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updated = checks.map((check) => ({ ...check, checked: isChecked }));
    setChecks(updated);
  };

  const handleChecksDisplay = (toggle) => {
    setChecksDisplay(toggle);
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      if (
        uploadSectionRef.current &&
        uploadSectionRef.current.handleProcessChecks
      ) {
        await uploadSectionRef.current.handleProcessChecks();
      }
      navigate("/my-view");
    } catch (error) {
      console.error("Execute failed:", error);
      uploadSectionRef.current.setUploadStatus("Failed to generate results.");
    }
    setLoading(false);
  };

  return (
    <div className="relative bg-[#f3f3f3] box-border min-h-screen w-full mx-auto flex flex-col items-center overflow-hidden">
      <div className="relative w-full max-h-screen">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="Home" />
          <div className="relative col-span-10 box-border max-h-screen grid-rows-12">
            <div className="grid row-span-1">
              <HeaderSection title="Home" />
            </div>
            <div className="relative grid grid-cols-12 gap-4 box-border p-3 overflow-y-auto h-[calc(100vh-112px)]">
              <UploadSection
                wrapperClassName="col-span-4"
                ref={uploadSectionRef}
                analyticalChecks={checks}
                handleChecksDisplay={handleChecksDisplay}
                setUploadComplete={setUploadComplete}
                setUploadStatus={(status) => {
                  if (uploadSectionRef.current) {
                    uploadSectionRef.current.setUploadStatus(status);
                  }
                }}
              />
              <div className="relative h-full col-span-8 bg-white box-border border border-[#e6e9eb] shadow-lg rounded-lg">
                  <div className="relative box-border p-6 gap-4 grid grid-flow-row">
                    <div className="relative grid grid-flow-col justify-between ">
                      <h2 className="relative text-md font-semibold text-gray-800">
                        Choose the analytical checks
                      </h2>
                      <div className="grid grid-flow-col items-center gap-3 mr-4 ">
                        <span className="text-sm text-gray-600">
                          Select All
                        </span>
                        <input
                          type="checkbox"
                          disabled={!uploadComplete}
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-3 h-3 text-[#012386] border-gray-300 rounded focus:ring-[#012386] accent-[#012386]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-col grid-rows-6 md:grid-rows-3 gap-4 box-border max-h-screen">
                      {checks.map((check) => (
                        <CheckCard
                          key={check.id}
                          check={check}
                          onToggle={handleToggleCheck}
                          checksDisplay={uploadComplete}
                        />
                      ))}
                    </div>
                    <div className="grid grid-flow-col justify-end">
                      <button
                        onClick={handleExecute}
                        disabled={!uploadComplete || loading}
                        className={`bg-[#012386] hover:bg-[#011d6b] text-white px-6 py-1 rounded-xl ${
                          !uploadComplete || loading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {loading ? (
                          <span className="font-semibold text-sm leading-7">
                            Generating...
                          </span>
                        ) : (
                          <span className="font-semibold text-sm leading-7">
                            Execute
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
              </div>
              {/* End col-span-8 */}
            </div>
            <div className="relative text-[#737891] text-xs py-4 px-6 items-end">
              * The results provided by this tool are powered by advanced
              analytics and are subject to user validation and interpretation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
