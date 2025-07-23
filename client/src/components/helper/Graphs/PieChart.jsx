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
    maintainAspectRatio: false, // allow responsive scaling
    responsive: true,
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
    <div className="bg-white rounded-xl shadow w-full p-2">
      <h2 className="text-sm font-semibold text-gray-800">Pass / Fail Split</h2>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="w-full sm:w-3/5 h-56">
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div className="w-full sm:w-2/5 flex items-center justify-center h-24">
          <BarChart value1={2} value2={10} value3={15} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
