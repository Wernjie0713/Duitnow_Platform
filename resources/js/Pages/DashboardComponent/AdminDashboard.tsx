import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import InputLabel from '@/Components/InputLabel';
import CumulativeLeaderboardTable from './CumulativeLeaderboardTable';
import MonthlyLeaderboardTable from './MonthlyLeaderboardTable';
import WeeklyLeaderboardTable from './WeeklyLeaderboardTable';
import FacultyRankingTable from './FacultyRankingTable';
import TransactionTable from "./TransactionTable";

// Register all necessary Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  LineElement,
  PointElement
);

// Preset vivid color palette for the line chart
const vividColors = [
  "#FF5733", // bright red-orange
  "#33FF57", // bright green
  "#3357FF", // vivid blue
  "#FF33A1", // hot pink
  "#A133FF", // vivid purple
  "#33FFF5", // bright cyan
  "#FF8F33", // vivid orange
  "#FF3333", // bright red
  "#33FFB5", // bright turquoise
  "#B533FF"  // vivid magenta
];

export default function AdminDashboard({
  // Leaderboard and table props
  weekly,
  monthly,
  cumulative,
  facultyRanking,
  weeklyAll,
  monthlyAll,
  cumulativeAll,
  transactions,
  current_user,
  isAdmin,

  // Summations
  total_nov_count,
  total_dec_count,
  total_cumulative_count,

  // Chart data props
  campusDistribution,   // e.g. { skudai, kl, pagoh }
  monthlyTransactions,  // e.g. { nov, dec }
  lineChartData         // daily data for top 10 winners
}) {
  // --------------------------
  // 1) State & Handlers for Table Filtering
  // --------------------------
  const [selectedValue, setSelectedValue] = useState(() => {
    const saved = localStorage.getItem("selectedValue");
    return saved !== null ? saved : '';
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const saved = localStorage.getItem("selectedTime");
    return saved !== null ? Number(saved) : 0;
  });
  const [selectedNumber, setSelectedNumber] = useState(() => {
    const saved = localStorage.getItem("selectedNumber");
    return saved !== null ? Number(saved) : 10;
  });

  const handleSelectedChange = (value) => {
    setSelectedValue(value);
    localStorage.setItem("selectedValue", value);
    setSelectedTime(0);
  };

  const handleSelectedTime = (value) => {
    const numericValue = parseInt(value, 10);
    setSelectedTime(numericValue);
    localStorage.setItem("selectedTime", numericValue.toString());
  };

  const handleSelectedNumber = (value) => {
    const numericValue = parseInt(value, 10);
    setSelectedNumber(numericValue);
    localStorage.setItem("selectedNumber", numericValue.toString());
  };

  useEffect(() => {
    const savedTime = localStorage.getItem("selectedTime");
    if (savedTime !== null) {
      setSelectedTime(Number(savedTime));
    }
  }, [selectedValue]);

  // --------------------------
  // 2) Chart Data Setup
  // --------------------------
  // a) Pie Chart: Campus Distribution
  const campusPieData = {
    labels: ['UTM Johor Bahru', 'UTM Kuala Lumpur', 'UTM Pagoh'],
    datasets: [
      {
        label: 'Participants',
        data: [
          campusDistribution?.skudai || 0,
          campusDistribution?.kl || 0,
          campusDistribution?.pagoh || 0
        ],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF"],
      }
    ]
  };
  const campusPieOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { size: 14 }
        }
      }
    },
    maintainAspectRatio: false,
  };

  // b) Bar Chart: Monthly Transactions
  const monthlyBarData = {
    labels: ['November', 'December'],
    datasets: [
      {
        label: 'Total Transactions',
        data: [
          monthlyTransactions?.nov || 0,
          monthlyTransactions?.dec || 0
        ],
        backgroundColor: ["#FF33A1", "#A133FF"],
      }
    ]
  };
  const monthlyBarOptions = {
    plugins: {
      legend: {
        display: false // Hide legend if it looks weird
      }
    },
    maintainAspectRatio: false,
  };

  // c) Line Chart: Aggregate daily data into monthly totals and add an initial zero value.
  const monthlySummary = aggregateToMonthly(lineChartData);
  const lineChartMonthlyData = buildLineChartForMonths(monthlySummary);
  const lineChartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12 },
          // Note: Chart.js doesn't natively support multi-column legends.
          // For a custom layout, you might disable the built‑in legend
          // and render a custom HTML legend below the chart.
        }
      }
    },
    maintainAspectRatio: false,
  };

  // --------------------------
  // 3) Render: Charts at Top, then Table Selection & Tables
  // --------------------------
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Charts Section at the Top */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* <h2 className="text-xl font-semibold mb-4">Admin Analytics</h2> */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column: Grid with 2 rows */}
          <div className="grid grid-rows-2 gap-4">
            
            <div className="bg-white shadow p-4 h-[18rem]">
              <h3 className="font-semibold mb-2">Campus Distribution</h3>
              <div className="h-[14rem]">
                <Pie data={campusPieData} options={campusPieOptions} />
              </div>
            </div>

            <div className="bg-white shadow p-4 h-[18rem]">
              <h3 className="font-semibold mb-2">Monthly Transactions</h3>
              <div className="h-[15rem]">
                <Bar data={monthlyBarData} options={monthlyBarOptions} />
              </div>
            </div>
            
          </div>
          {/* Right Column: Line Chart spanning both rows with increased height */}
          <div className="h-[37rem]">
            <div className="bg-white shadow p-4 h-full">
              <h3 className="font-semibold mb-2">Top 10 Winners Trend</h3>
              <div className="h-[34rem]">
                <Line data={lineChartMonthlyData} options={lineChartOptions} />
              </div>
              {/* 
                For a custom multi-column legend below the line chart, you could disable
                the built-in legend (legend.display: false) and then render your own custom
                legend here using the lineChartMonthlyData.datasets.
                For example, you might render a div with flex-wrap and two columns.
              */}
              {/* <div className="mt-2 flex flex-wrap">
                {lineChartMonthlyData.datasets.map((ds, index) => (
                  <div key={index} className="w-1/2 flex items-center mb-1">
                    <span className="w-4 h-4 mr-2" style={{ backgroundColor: ds.borderColor }}></span>
                    <span className="text-sm">{ds.label}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Table Selection & Filters Section */}
      {/* <div className="bg-white rounded-lg shadow p-4 sm:p-6 max-w-md mt-6">
        <InputLabel htmlFor={selectedValue} value="Filter Table" className="mb-2 pl-1 font-semibold" />
        <Select onValueChange={handleSelectedChange} value={selectedValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select table"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Cumulative">Cumulative</SelectItem>
            <SelectItem value="FacultyRanking">Faculty Ranking</SelectItem>
            <SelectItem value="TransactionTable">Transaction Table</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4 gap-4">
          {selectedValue === 'Weekly' && (
            <Select onValueChange={handleSelectedTime} value={selectedTime.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select Week Number"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Week 1</SelectItem>
                <SelectItem value="2">Week 2</SelectItem>
                <SelectItem value="3">Week 3</SelectItem>
                <SelectItem value="4">Week 4</SelectItem>
                <SelectItem value="5">Week 5</SelectItem>
                <SelectItem value="6">Week 6</SelectItem>
                <SelectItem value="7">Week 7</SelectItem>
              </SelectContent>
            </Select>
          )}
          {selectedValue === 'Monthly' && (
            <Select onValueChange={handleSelectedTime} value={selectedTime.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select Month"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          )}
          {(selectedValue === 'Weekly' || selectedValue === 'Monthly' || selectedValue === 'Cumulative') && (
            <Select onValueChange={handleSelectedNumber} value={selectedNumber.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select number"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="100">Top 100</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div> */}

      {/* Tables Section */}
      {/* <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-6">
        {selectedValue === 'Weekly' && (
          <WeeklyLeaderboardTable
            users={weekly.data}
            links={weekly.links}
            current_user={current_user}
            isAdmin={isAdmin}
            selectedNumber={selectedNumber}
            selectedTime={selectedTime}
            weeklyAll={weeklyAll}
          />
        )}
        {selectedValue === 'Monthly' && (
          <MonthlyLeaderboardTable
            users={monthly.data}
            links={monthly.links}
            current_user={current_user}
            isAdmin={isAdmin}
            selectedNumber={selectedNumber}
            selectedTime={selectedTime}
            monthlyAll={monthlyAll}
          />
        )}
        {selectedValue === 'Cumulative' && (
          <CumulativeLeaderboardTable
            users={cumulative.data}
            links={cumulative.links}
            current_user={current_user}
            isAdmin={isAdmin}
            selectedNumber={selectedNumber}
            title="Cumulative Top 10"
            duration="November 10th, 2024 (12:00 a.m) - December 28th, 2024 (11:59 p.m)"
            cumulativeAll={cumulativeAll}
          />
        )}
        {selectedValue === 'FacultyRanking' && (
          <FacultyRankingTable faculties={facultyRanking} />
        )}
        {selectedValue === 'TransactionTable' && (
          <TransactionTable transactions={transactions.data} links={transactions.links} />
        )}
      </div> */}
    </div>
  );
}

/**
 * Aggregates daily lineChartData into monthly totals for each user.
 * Returns an array of objects: { user_id, name, nov, dec }.
 */
function aggregateToMonthly(rawLineData) {
  const monthlySummary = [];
  rawLineData.forEach(userObj => {
    let novSum = 0;
    let decSum = 0;
    userObj.data.forEach(({ date, total }) => {
      const month = new Date(date).getMonth() + 1; // 1=Jan, 11=Nov, 12=Dec
      if (month === 11) {
        novSum += total;
      } else if (month === 12) {
        decSum += total;
      }
    });
    monthlySummary.push({
      user_id: userObj.user_id,
      name: userObj.name,
      nov: novSum,
      dec: decSum
    });
  });
  return monthlySummary;
}

/**
 * Builds a line chart config where each user has three data points:
 * [0, November total, December total].
 * Labels: ["Initial", "November", "December"]
 */
function buildLineChartForMonths(monthlySummary) {
  const labels = ['Initial', 'November', 'December'];
  const datasets = monthlySummary.map((user, index) => ({
    label: user.name,
    data: [0, user.nov, user.dec],
    fill: false,
    borderColor: vividColors[index % vividColors.length],
    tension: 0.1
  }));
  return { labels, datasets };
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
