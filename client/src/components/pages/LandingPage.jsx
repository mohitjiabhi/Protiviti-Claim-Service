import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import marutiWhiteLogo from "../../assets/maruti-white-logo.svg";
import deLogo from "../../assets/power-by-DE-logo.png";
import landingpageImg from "../../assets/landing-page-img.svg";
import intelliAuditLogofrom from "../../assets/intelliAudit-logo.svg";
// import { loginClient } from "common-partner-login-client/lib/esm";

const LandingPage = () => {
  const [status, setStatus] = useState("Not started");
  const API_KEY = "your-api-key-goes-here"; // Replace with actual API key
  const MSPIN = "example-mspin"; // Replace with actual MSPIN

  // useEffect(() => {
  //   // Initialize the SDK on component mount
  //   loginClient
  //     .init(API_KEY)
  //     .then(() => setStatus("SDK initialized successfully"))
  //     .catch((error) => setStatus(`Initialization failed: ${error.message}`));
  // }, [API_KEY]);

  const handleOtpFlow = () => {
    // setStatus("Sending OTP...");
    // loginClient
    //   .sendOtp(MSPIN)
    //   .then(() => {
    //     setStatus("OTP sent successfully. Verifying...");
    //     return loginClient.verifyOtp("123456"); // Replace with actual OTP
    //   })
    //   .then((response) => {
    //     setStatus(`Verification successful: ${JSON.stringify(response)}`);
    //     console.log("Verification response:", response);
    //   })
    //   .catch((error) => {
    //     setStatus(`Error: ${error.message}`);
    //     console.error("Error:", error);
    //   });
  };

  return (
    <div className="grid grid-flow-row grid-cols-12 items-center justify-center h-screen bg-gray-100 w-full font-roboto">
      <div
        className={`col-span-8 border-black h-full bg-cover bg-center bg-blue-500`}
        style={{ backgroundImage: `url(${landingpageImg})` }}
      >
        <div className="absolute w-2/3 inset-0 bg-[#00264499]" />
        <img
          src={marutiWhiteLogo}
          alt="Maruti Logo"
          width="200"
          className="absolute h-10 object-contain pl-4 pt-4"
        />
      </div>
      <div className="col-span-4 h-screen items-center justify-center text-center">
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <img
            src={deLogo}
            alt="Powered by DE Logo"
            width="200"
            className="absolute h-10 object-contain right-0 top-0"
          />
          <div>
            <img
              src={intelliAuditLogofrom}
              alt="IntelliAudit Icon"
              className="mx-auto h-20 pl-5"
            />
            <h1 className="text-4xl font-bold text-[#012386]">
              <span className="text-xl font-medium">Welcome to</span>{" "}
              IntelliAudit
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-xs">
            "See Beyond the Surface – AI Powered Insights."
          </p>
          {/* <p className="text-sm text-gray-700">{status}</p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleOtpFlow}
              className="mt-6 px-6 py-3 bg-[#012386] text-white rounded-full flex justify-center items-center hover:bg-blue-800"
            >
              Start OTP Flow
            </button> */}
          <Link to="/home">
            <button className="mt-6 px-6 py-3 bg-[#012386] text-white rounded-full flex justify-center items-center hover:bg-blue-800 ml-4">
              Launch
            </button>
          </Link>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
