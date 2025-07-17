import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import BarChart from "./BarChart";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

const PieChart = () => {
  const totalDocs = 36;
  const passedDocs = 30;
  const failedDocs = 6;

  const pieData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [passedDocs, failedDocs],
        backgroundColor: ["#3CD188", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (sum, val) => sum + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(0);
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value} doc, (${percentage}%)`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 10,
          family: "'Inter', sans-serif",
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 8,
      },
    },
  };

  return (
    <div className="row-span-4 bg-white rounded-xl shadow p-2 w-full mx-auto items-start justify-start">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">
        Pass / Fail Split
      </h2>
      <div className="grid grid-flow-col items-center">
        <div className="w-48 h-48">
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div className="w-full h-24 grid text-start">
          <BarChart value1={2} value2={10} value3={15} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
