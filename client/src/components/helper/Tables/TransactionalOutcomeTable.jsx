import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DocPreviewModal from "../Modals/DocPreviewModal";
import downloadIcon from "../../../assets/downloadIcon.svg";
import reportTableData from "../../utils/reportTableData";

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
  // const handleTableModal = () => {
  //   setTableModal(true);
  // };
  // const handleTableCloseModal = () => {
  //   setTableModal(false);
  // };
  return (
    <div className=" col-span-8 bg-white rounded-md shadow-sm py-1 h-full">
      <div className="flex flex-row gap-2">
        <span className="border-2 border-[#012378] rounded-md"></span>
        <span className="text-md font-medium text-[#012378] p-1">
          Transactional Outcome
        </span>
      </div>
      <div className="mt-2  h-[calc(100vh-200px)] overflow-y-auto px-2 rounded-md">
        <table className="min-w-full text-xs text-gray-800 border-collapse text-center rounded-md border border-gray-200 max-h-96 md:max-h-[200px] ">
          <thead className="sticky top-0 bg-gray-100 text-xs font-normal  text-gray-600">
            <tr>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                S.No
              </th>
              <th className="box-border px-2 py-2 whitespace-nowrap border border-gray-200">
                ID
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
          <tbody className="divide-y text-xs font-normal">
            {reportTableData.map((row, i) => (
              <tr key={i} className="">
                <td className="box-border px-2 py-2 border border-gray-200">
                  {i + 1}
                </td>
                <td className="box-border px-2 py-2 border border-gray-200">
                  {row.id}
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
                      <button onClick={() => handleThumbsDownClick(row.url)}>
                        <div className="border rounded-full p-2 bg-green-500 shadow-sm"></div>
                      </button>
                    ) : status === "fail" ? (
                      <button onClick={() => handleThumbsDownClick(row.url)}>
                        <div className="border rounded-full p-2 bg-red-500 shadow-sm"></div>
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
      {/* <MyViewTableModal isOpen={tableModal} onClose={handleTableCloseModal} /> */}
      <div className="mt-2 mr-2 flex justify-end items-center ">
        <button
          className="flex flex-row gap-2 justify-between items-center border bg-[#012378] px-4 rounded-lg p-2"
          onClick=""
        >
          <div className="text-sm text-white font-bold">Download</div>
          <img src={downloadIcon} alt="download" />
        </button>
      </div>
    </div>
  );
};

export default TransactionalOutcomeTable;
