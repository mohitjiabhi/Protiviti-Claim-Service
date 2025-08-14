import React, { useState, useRef, useEffect } from "react";
import HeaderSection from "../helper/HeaderSection";
import SideBar from "../helper/SideBar";
import UploadSection from "../helper/UploadSection";
import { Link, useNavigate } from "react-router-dom";
import CheckCard from "../helper/CheckCard";
import initialChecks from "../utils/initialChecks";
import { createSession, getSession, clearSession } from "../utils/session";
import axios from "axios";

const HomePage = () => {
  const [checks, setChecks] = useState(initialChecks);
  const [selectAll, setSelectAll] = useState(
    initialChecks.every((c) => c.checked)
  );
  const [checksDisplay, setChecksDisplay] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const navigate = useNavigate();
  const uploadSectionRef = useRef(null);

  // Initialize session on page load
  useEffect(() => {
    const sessionData = {
      username: "john_doe",
      loginTime: Date.now(),
    };
    createSession(sessionData);
    console.log("Session created:", sessionData);

    const interval = setInterval(() => {
      const session = getSession();
      if (!session) {
        alert("Session expired");
        clearInterval(interval);
        // Redirect to landing page or login (simulated as alert for now)
        window.location.href = "/"; // Adjust to your landing page route
      } else {
        console.log("Session Active:", session);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

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
        const session = getSession();
        // if (!session) {
        //   alert("Session expired. Please restart the session.");
        //   setLoading(false);
        //   return;
        // }

        // Add session data to the payload
        const checksPayload = {
          requestId: uploadSectionRef.current.requestId, // Assuming requestId is accessible
          checks: {
            duplicate: checks.some(
              (c) => c.id === "deduplication" && c.checked
            ),
            pdfEditForge: checks.some((c) => c.id === "pdf-edit" && c.checked),
            metadataCheck: checks.some((c) => c.id === "metadata" && c.checked),
            tamper: checks.some((c) => c.id === "image-tampering" && c.checked),
            copyMoveForge: checks.some(
              (c) => c.id === "copy-move" && c.checked
            ),
            qrCode: checks.some((c) => c.id === "qr-code" && c.checked),
          },
          checksJsonColl: responseData
        };

        await axios.post(
          `http://localhost:5001/enterprise/process`,
          checksPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Simulate loader with delay
        setTimeout(() => {
          setLoading(false);
          navigate("/my-view");
        }, 3000); // 3-second delay for loader
      }
    } catch (error) {
      console.error("Execute failed:", error);
      uploadSectionRef.current.setUploadStatus("Failed to generate results.");
      setLoading(false);
    }
  };

  return (
    <div className="relative box-border min-h-screen w-full mx-auto flex flex-col items-center overflow-hidden">
      <div className="relative w-full max-h-screen">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="Home" />
          <div className="relative col-span-10 box-border max-h-screen grid-rows-12">
            <div className="grid row-span-1">
              <HeaderSection title="Home" />
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 box-border p-3 overflow-y-auto h-[calc(100vh-112px)]">
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
                setResponseData={setResponseData}
              />
              <div className="relative h-full col-span-1 md:col-span-8 bg-white box-border border border-[#e6e9eb] shadow-sm rounded-lg">
                <div className="relative box-border p-6 gap-4 grid grid-flow-row">
                  <div className="relative grid grid-flow-col justify-between ">
                    <h2 className="relative text-md font-semibold text-gray-800">
                      Choose the analytical checks
                    </h2>
                    <div className="grid grid-flow-col items-center gap-3 mr-4 ">
                      <span className="text-sm text-gray-600">Select All</span>
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
                        <span className="font-semibold text-sm leading-7 flex items-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          Executing...
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
            <div className="relative text-[#737891] bg-inherit text-xs py-4 px-6 items-end">
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
