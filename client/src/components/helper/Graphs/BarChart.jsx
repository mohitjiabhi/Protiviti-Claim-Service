import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ value1, value2, value3 }) => {
  const data = {
    labels: [""],
    datasets: [
      {
        label: "1 Check Failed",
        data: [value1],
        backgroundColor: "#FFC1C1",
        borderRadius: 4,
        barThickness: 40,
        textColor: "#fff",
      },
      {
        label: "2 Checks Failed",
        data: [value2],
        backgroundColor: "#FF8080",
        borderRadius: 4,
        barThickness: 40,
      },
      {
        label: "3+ Checks Failed",
        data: [value3],
        backgroundColor: "#FF0000",
        borderRadius: 4,
        barThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        display: false,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        reverse: true, // 👈 This makes the bars grow downward
        max: value1 + value2 + value3,
        display: false,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        displayColors: false,

        callbacks: {
          title: () => "",
          label: (context) => {
            let label = context.dataset.label || "";
            return `${label}: ${context.parsed.y}`;
          },
        },
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="w-full h-24">
      <Bar data={data} options={options} width={10} />
    </div>
  );
};

export default BarChart;
