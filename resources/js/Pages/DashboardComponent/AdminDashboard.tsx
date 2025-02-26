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

// Register Chart.js components
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
  "#FF8F33", // vivid orange for Transfer
  "#A1FF33", // bright lime green
  "#33FFF5", // bright cyan
  "#FF33A1", // bright pink
  "#A133FF", // bright purple
  "#FFA133", // bright amber
  "#3333FF", // bright blue
  "#FF33FF", // bright magenta
  "#33FF33", // bright green
];

interface AdminDashboardProps {
  // Leaderboard and table props
  weekly: any;
  monthly: any;
  cumulative: any;
  facultyRanking: any;
  weeklyAll: any;
  monthlyAll: any;
  cumulativeAll: any;
  transactions: any;
  current_user: any;
  isAdmin: boolean;

  // Summations
  total_nov_count: number;
  total_dec_count: number;
  total_cumulative_count: number;

  // Chart data props
  campusDistribution: { skudai: number; kl: number; pagoh: number };
  monthlyTransactions: { nov: number; dec: number };
  lineChartData: any; // daily data for top 10 winners

  // New prop: raw counts for transaction types (including NULL)
  transactionTypeCounts: {
    "DuitNow QR TNGD": number;
    "DuitNow QR": number;
    "Payment": number;
    "transfer": number;
    "NULL": number;
  };
}

export default function AdminDashboard({
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
  total_nov_count,
  total_dec_count,
  total_cumulative_count,
  campusDistribution,
  monthlyTransactions,
  lineChartData,
  transactionTypeCounts
}: AdminDashboardProps) {
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

  const handleSelectedChange = (value: string) => {
    setSelectedValue(value);
    localStorage.setItem("selectedValue", value);
    setSelectedTime(0);
  };

  const handleSelectedTime = (value: string) => {
    const numericValue = parseInt(value, 10);
    setSelectedTime(numericValue);
    localStorage.setItem("selectedTime", numericValue.toString());
  };

  const handleSelectedNumber = (value: string) => {
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
  // a) Campus Distribution Pie Chart
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
        labels: { font: { size: 14 } }
      }
    },
    maintainAspectRatio: false,
  };

  // b) Monthly Transactions Bar Chart
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
      legend: { display: false }
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
        labels: { font: { size: 12 } }
      }
    },
    maintainAspectRatio: false,
  };

  // d) Transaction Type Pie Chart:
  // First, extract raw counts
  const rawTNGD = transactionTypeCounts["DuitNow QR TNGD"] || 0;
  const rawQR = transactionTypeCounts["DuitNow QR"] || 0;
  const rawPayment = transactionTypeCounts["Payment"] || 0;
  const rawTransfer = transactionTypeCounts["transfer"] || 0;
  const nullCount = transactionTypeCounts["NULL"] || 0;

  // Distribute NULL count using the scale 5:3:2:1.
  const totalWeight = 5 + 3 + 2 + 1; // 11
  const additionalTNGD = Math.floor(nullCount * 5 / totalWeight);
  const additionalQR = Math.floor(nullCount * 3 / totalWeight);
  const additionalPayment = Math.floor(nullCount * 2 / totalWeight);
  // Ensure the remainder is assigned to transfer:
  const additionalTransfer = nullCount - (additionalTNGD + additionalQR + additionalPayment);

  const adjustedTNGD = rawTNGD + additionalTNGD;
  const adjustedQR = rawQR + additionalQR;
  const adjustedPayment = rawPayment + additionalPayment;
  const adjustedTransfer = rawTransfer + additionalTransfer;

  const transactionTypePieData = {
    labels: ["DuitNow QR TNGD", "DuitNow QR", "Payment", "Transfer"],
    datasets: [
      {
        label: "Transaction Types",
        data: [adjustedTNGD, adjustedQR, adjustedPayment, adjustedTransfer],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF8F33"],
      }
    ]
  };
  const transactionTypePieOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { size: 14 } }
      }
    },
    maintainAspectRatio: false,
  };

  // --------------------------
  // 3) Render: 2x2 Grid of Charts at the Top, then Table Sections
  // --------------------------
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Charts Section: 2x2 Grid */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* First Row */}
          <div className="bg-white shadow p-4 h-[18rem]">
            <h3 className="font-semibold mb-2">Campus Distribution</h3>
            <div className="h-[14rem]">
              <Pie data={campusPieData} options={campusPieOptions} />
            </div>
          </div>
          <div className="bg-white shadow p-4 h-[18rem]">
            <h3 className="font-semibold mb-2">Transaction Type Distribution</h3>
            <div className="h-[14rem]">
              <Pie data={transactionTypePieData} options={transactionTypePieOptions} />
            </div>
          </div>
          {/* Second Row */}
          <div className="bg-white shadow p-4 h-[30rem]">
            <h3 className="font-semibold mb-2">Monthly Transactions</h3>
            <div className="h-[27rem]">
              <Bar data={monthlyBarData} options={monthlyBarOptions} />
            </div>
          </div>
          <div className="bg-white shadow p-4 h-[30rem]">
            <h3 className="font-semibold mb-2">Top 10 Winners Trend</h3>
            <div className="h-[27rem]">
              <Line data={lineChartMonthlyData} options={lineChartOptions} />
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
            <SelectItem value="Weekly">Weekly</SelectItem>
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

      {/* Tables Section (Optional, commented out) */}
      {/*
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-6">
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
      </div>
      */}
    </div>
  );
}

/**
 * Aggregates daily lineChartData into monthly totals for each user.
 * Returns an array of objects: { user_id, name, nov, dec }.
 */
function aggregateToMonthly(rawLineData: any[]): { user_id: number; name: string; nov: number; dec: number }[] {
  const monthlySummary: { user_id: number; name: string; nov: number; dec: number }[] = [];
  rawLineData.forEach(userObj => {
    let novSum = 0;
    let decSum = 0;
    userObj.data.forEach(({ date, total }: { date: string; total: number }) => {
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
function buildLineChartForMonths(monthlySummary: { user_id: number; name: string; nov: number; dec: number }[]) {
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
