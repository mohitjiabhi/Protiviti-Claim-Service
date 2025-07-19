import { Bar } from "react-chartjs-2";
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

const BarGraph = () => {
  const checkFailureData = {
    labels: ["De-duplication", "PDF edit", "Copy move", "Metadata", "QR code"],
    datasets: [
      {
        label: "Failed Docs",
        data: [10, 12, 14, 8, 2],
        backgroundColor: "#012378",
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };

  const checkFailureOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false,
        color: "#fff",
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 10,
        },
        formatter: (value) => value,
      },
      title: {
        display: false,
        text: "Check wise documents failed",
        align: "start",
        color: "#333",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
          precision: 0,
          display: false,
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#000",
          font: {
            size: 10,
          },
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="bg-white rounded-md shadow-sm gap-2">
      <h2 className="text-xs font-medium p-2">Check wise documents failed</h2>
      <Bar data={checkFailureData} options={checkFailureOptions} />
    </div>
  );
};

export default BarGraph;
