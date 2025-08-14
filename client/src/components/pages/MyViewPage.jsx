import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";
import BarGraph from "../helper/Graphs/BarGraph";
import PieChart from "../helper/Graphs/PieChart";
import TransactionalOutcomeTable from "../helper/Tables/TransactionalOutcomeTable";
import BarChart from "../helper/Graphs/BarChart";
import { Link } from "react-router-dom";
import previousReportData from "../utils/previousReportData";

const MyViewPage = () => {
  return (
    <div className="bg-[#f3f3f3] min-h-screen w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Sidebar */}
        <SideBar activePage="My View" />

        {/* Main Content */}
        <div className="lg:col-span-10 flex flex-col h-full">
          {/* Header */}
          <HeaderSection title="My View" />

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 overflow-auto h-[calc(100vh-112px)]">
            {/* Left Section */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <h2 className="text-xl text-[#012378] font-semibold pb-3">
                Session Outcome
              </h2>

              {/* Pie + Horizontal BarChart */}
              <PieChart />

              {/* Checkwise BarGraph */}
              <BarGraph />

              {/* Previous Reports Table */}
              <div className="relative bg-white rounded-md shadow-sm py-2">
                <div className="flex items-center gap-2 pb-2">
                  <span className="border-2 border-[#012378] rounded-md h-7"></span>
                  <h3 className="text-sm text-[#012378] font-medium">
                    Last 10 Reports
                  </h3>
                </div>
                <div className="relative overflow-y-auto max-h-48 px-2">
                  <table className="w-full text-xs border border-collapse border-gray-200 text-center">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="border p-1">S.No</th>
                        <th className="border p-1">Report No.</th>
                        <th className="border p-1">Date & Time</th>
                        <th className="border p-1">No. of Docs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousReportData.map((row, i) => (
                        <tr key={i}>
                          <td className="border p-1">{i + 1}</td>
                          <td className="border p-1">
                            <Link
                              to="/my-view"
                              target="_blank"
                              className="text-blue-600 underline"
                            >
                              {row.report}
                            </Link>
                          </td>
                          <td className="border p-1">{row.dateAndTime}</td>
                          <td className="border p-1">{row.numberOfDoc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="lg:col-span-8 flex flex-col gap-3 w-full">
              {/* Stats Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="flex items-center justify-between bg-white p-2 py-1 rounded-md shadow">
                  <div className="text-xs font-medium">Docs Checked</div>
                  <div className="text-xs font-medium bg-[#3CD188] text-white px-2 py-1 rounded">
                    42,200
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white p-2 py-1 rounded-md shadow">
                  <div className="text-xs font-medium">Data Processed</div>
                  <div className="text-xs font-medium bg-[#012378] text-white px-2 py-1 rounded">
                    1.5GB
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white p-2 py-1 rounded-md shadow">
                  <div className="text-xs font-medium">Processing Time</div>
                  <div className="text-xs font-medium bg-[#012378] text-white px-2 py-1 rounded">
                    2 Min
                  </div>
                </div>
              </div>

              {/* Transactional Outcome Table */}
              <TransactionalOutcomeTable />
            </div>
          </div>

          {/* Footer */}
          <div className="text-[#737891] text-xs p-4">
            * The results provided by this tool are powered by advanced
            analytics and are subject to user validation and interpretation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyViewPage;
