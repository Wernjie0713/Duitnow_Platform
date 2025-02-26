import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
    </div>
  </div>
);

interface DashboardStatsProps {
  // Commented out previous props:
  // current_user: any;
  // cumulative: any[];
  // weekly: any[];
  // monthly: any[];
  
  // New props:
  total_users: number;
  total_transactions: number;
}

export default function DashboardStats({
  // Uncomment these if needed later:
  // current_user,
  // cumulative,
  // weekly,
  // monthly,
  total_users,
  total_transactions,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {/*
      <StatCard
        title="Total Transaction Count"
        value={current_user.total_count}
        icon={<svg className="w-6 h-6 text-gray-400" ... > ... </svg>}
      />
      <StatCard
        title="Weekly Rank"
        value={weeklyRank}
        icon={<svg className="w-6 h-6 text-gray-400" ... > ... </svg>}
      />
      <StatCard
        title="Monthly Rank"
        value={monthlyRank}
        icon={<svg className="w-6 h-6 text-gray-400" ... > ... </svg>}
      />
      <StatCard
        title="Cumulative Rank"
        value={cumulativeRank}
        icon={<svg className="w-6 h-6 text-gray-400" ... > ... </svg>}
      />
      */}
      {/* New stat card for total users */}
      <StatCard
        title="Total Users"
        value={total_users.toString()}
        icon={
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 10-8 0 4 4 0 008 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      {/* New stat card for total transactions */}
      <StatCard
        title="Total Transactions"
        value={total_transactions.toString()}
        icon={
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        }
      />
    </div>
  );
}
