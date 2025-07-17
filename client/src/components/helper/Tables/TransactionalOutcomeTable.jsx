import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import samplePdf from "../../../assets/samplePDF.pdf";
import aadharImg from "../../../assets/aadharImg.svg";
import { useState } from "react";
import DocPreviewModal from "../Modals/DocPreviewModal";
import MyViewTableModal from "../Modals/MyViewTableModal";

const TransactionalOutcomeTable = () => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState({ fileUrl: "" });
  const [tableModal, setTableModal] = useState(false);

  const handleThumbsDownClick = (url) => {
    setPreviewFile({
      fileUrl: url,
    });
    setIsPreviewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewFile({ fileUrl: "" });
  };
  const handleTableModal = () => {
    setTableModal(true);
  };
  const handleTableCloseModal = () => {
    setTableModal(false);
  };
  return (
    <div className=" col-span-8 bg-white rounded-md shadow-sm pt-2">
      <div className="flex flex-row gap-2">
        <span className="border-2 border-[#012378] rounded-md"></span>
        <span className="text-md font-medium text-[#012378] p-1">
          Transactional Outcome
        </span>
      </div>
      <div className="mt-4 max-h-96 md:max-h-[600px] overflow-y-auto px-2 rounded-md">
        <table className="min-w-full text-xs text-gray-800 border-collapse text-center rounded-md border border-gray-200">
          <thead className="sticky top-0 bg-gray-100 text-xs font-normal  text-gray-600">
            <tr>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                S.no
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                File Name
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                Risk Profile
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                De-Duplication
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                PDF Edit
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                Copy Move
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                Metadata
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                QR Code
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                Image Edit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs  font-normal">
            {[
              {
                file: "Aadhaar Card",
                risk: "High",
                checks: ["fail", "fail", "fail", "pass", "-", "fail"],
                url: aadharImg,
              },
              {
                file: "PAN Card",
                risk: "Medium",
                checks: ["pass", "pass", "pass", "pass", "-", "fail"],
                url: samplePdf,
              },
              {
                file: "Passport",
                risk: "Low",
                checks: ["pass", "pass", "fail", "pass", "-", "pass"],
              },
              {
                file: "Voter ID Card",
                risk: "High",
                checks: ["fail", "fail", "fail", "pass", "-", "fail"],
              },
              {
                file: "Driving License",
                risk: "Medium",
                checks: ["pass", "fail", "fail", "pass", "-", "fail"],
              },
              {
                file: "Birth Certificate",
                risk: "Low",
                checks: ["pass", "pass", "pass", "pass", "-", "pass"],
              },
              {
                file: "Annual Reports",
                risk: "High",
                checks: ["fail", "fail", "fail", "pass", "-", "fail"],
              },
              {
                file: "Aadhaar Card",
                risk: "Medium",
                checks: ["pass", "fail", "fail", "pass", "-", "fail"],
              },
              {
                file: "PAN Card",
                risk: "Low",
                checks: ["pass", "pass", "fail", "pass", "-", "fail"],
              },
              {
                file: "Passport",
                risk: "Low",
                checks: ["pass", "pass", "fail", "pass", "-", "fail"],
              },
              {
                file: "Driving License",
                risk: "Low",
                checks: ["pass", "pass", "pass", "pass", "-", "pass"],
              },
              {
                file: "Aadhaar Card",
                risk: "Medium",
                checks: ["pass", "fail", "fail", "pass", "-", "fail"],
              },
              {
                file: "PAN Card",
                risk: "Low",
                checks: ["pass", "pass", "fail", "pass", "-", "fail"],
              },
              {
                file: "Passport",
                risk: "Low",
                checks: ["pass", "pass", "fail", "pass", "-", "fail"],
              },
              {
                file: "Driving License",
                risk: "Low",
                checks: ["pass", "pass", "pass", "pass", "-", "pass"],
              },
            ].map((row, i) => (
              <tr key={i} className="">
                <td className="box-border px-2 py-2 border border-gray-200">
                  {i + 1}
                </td>
                <td className="box-border px-2 py-2 border border-gray-200">
                  {row.file}
                </td>
                <td className="box-border px-2 py-2 border border-gray-200">
                  {row.risk}
                </td>
                {row.checks.map((status, idx) => (
                  <td
                    key={idx}
                    className="box-border px-2 py-2 border border-gray-200"
                  >
                    {status === "pass" ? (
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="text-green-500 w-4 h-4"
                      />
                    ) : status === "fail" ? (
                      <button onClick={() => handleThumbsDownClick(row.url)}>
                        <FontAwesomeIcon
                          icon={faThumbsDown}
                          className="text-red-500 w-4 h-4"
                        />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DocPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleCloseModal}
        fileUrl={previewFile.fileUrl}
      />
      <MyViewTableModal isOpen={tableModal} onClose={handleTableCloseModal} />
      <div className="mt-5 absolute bottom-0 right-0 p-4">
        <button
          className="flex flex-row gap-2 justify-between items-center border bg-[#E9EBEC] px-2 rounded-lg"
          onClick={handleTableModal}
        >
          <div className="text-xs font-medium">
            Click here to view your last 10 reports
          </div>
          <span className="text-slate-400 font-thin">|</span>
          <div className="mb-2">⌄</div>
        </button>
      </div>
    </div>
  );
};

export default TransactionalOutcomeTable;
