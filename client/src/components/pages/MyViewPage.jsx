import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";
import BarGraph from "../helper/Graphs/BarGraph";
import PieChart from "../helper/Graphs/PieChart";
import TransactionalOutcomeTable from "../helper/Tables/TransactionalOutcomeTable";
import BarChart from "../helper/Graphs/BarChart";

const MyViewPage = () => {
  return (
    <div className="bg-[#f3f3f3] h-screen w-full">
      <div className="w-full h-auto">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="My View" />
          <div className="relative col-span-10 box-border max-h-screen grid grid-rows-12">
            <div className="row-span-1">
              <HeaderSection title="My View" />
            </div>
            <div className="relative grid grid-cols-12 row-span-11 gap-4 p-3 max-h-screen overflow-y-auto">
              <div className="col-span-12 lg:col-span-4 grid grid-rows-10 gap-4">
                <div className="grid grid-cols-2 row-span-1 gap-2">
                  <div className="col-span-1 p-2 bg-white gap-2 rounded-md shadow-sm grid grid-cols-2 items-center justify-between">
                    <div className="grid col-span-1 text-xs font-medium text-left">
                      Doc checked
                    </div>
                    <div className="grid col-span-1 text-xs font-medium p-2 rounded-md bg-[#3CD188] text-white text-center">
                      42,200
                    </div>
                  </div>
                  <div className="col-span-1 p-2 bg-white rounded-md shadow-sm grid grid-flow-col justify-between items-center gap-2">
                    <div className="text-xs font-medium text-left">
                      Data processed
                    </div>
                    <div className="text-xs font-medium p-2 rounded-md bg-[#012378] text-white text-center">
                      1.5GB
                    </div>
                  </div>
                </div>
                <div className="grid row-span-5 items-center text-[#012378] font-medium w-full ">
                  Outcome Overview
                  <PieChart />
                </div>
                <div className="grid row-span-5 w-full">
                  <BarGraph />
                </div>
              </div>
              <div className="relative grid col-span-12 lg:col-span-8">
                <TransactionalOutcomeTable />
              </div>
            </div>
            <div className="text-[#737891] text-xs px-6 grid row-span-1 items-end">
              * The results provided by this tool are powered by advanced
              analytics and are subject to user validation and interpretation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyViewPage;
