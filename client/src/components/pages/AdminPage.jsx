import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";
import BarGraph from "../helper/Graphs/BarGraph";
import PieChart from "../helper/Graphs/PieChart";
import UserTable from "../helper/Tables/UserTable";
import activeUserData from "../utils/activeUserData";
import LineGraph from "../helper/Graphs/LineGraph";
import DateFilter from "../helper/DateFilter";

const AdminPage = () => {
  return (
    <div className="bg-[#f3f3f3] min-h-screen w-full">
      <div className="w-full h-auto">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="Admin View" />

          <div className="relative col-span-10 box-border grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">
            <HeaderSection title="Admin View" />

            <div className="p-4 overflow-y-auto grid grid-cols-12 gap-4">
              {/* Top Filters and Stats */}
              <div className="col-span-12 grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <DateFilter />
                </div>

                <div className="col-span-4 bg-white rounded-md shadow-sm p-2 flex justify-between items-center text-sm font-medium">
                  <span>Docs checked</span>
                  <span className="px-2 py-1 rounded bg-[#3CD188] text-white text-center text-xs">
                    42,200
                  </span>
                </div>

                <div className="col-span-4 bg-white rounded-md shadow-sm p-2 flex justify-between items-center text-sm font-medium">
                  <span>Data processed</span>
                  <span className="px-2 py-1 rounded bg-[#012378] text-white text-center text-xs">
                    1.5GB
                  </span>
                </div>
              </div>

              {/* Outcome and Users Overview */}
              <div className="col-span-12 grid grid-cols-12 gap-4">
                {/* Left Section */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                  <div>
                    <h2 className="text-[#012378] text-sm font-semibold mb-2">
                      Outcome Overview
                    </h2>
                    <PieChart />
                  </div>
                  <BarGraph />
                </div>

                {/* Right Section */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <UserTable
                      title="Most active user"
                      tableData={activeUserData}
                      tableHeaders={[
                        "User Name",
                        "# of logins",
                        "# of docs analyzed",
                      ]}
                    />
                    <UserTable
                      title="Most in-active user"
                      tableData={activeUserData}
                      tableHeaders={[
                        "User Name",
                        "# of logins",
                        "# of docs analyzed",
                      ]}
                    />
                  </div>
                  <LineGraph />
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="px-6 py-2 text-xs text-[#737891]">
              * The results provided by this tool are powered by advanced
              analytics and are subject to user validation and interpretation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
