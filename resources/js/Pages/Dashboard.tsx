import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head } from '@inertiajs/react';
import CumulativeLeaderboardTable from './DashboardComponent/CumulativeLeaderboardTable';
import MonthlyLeaderboardTable from './DashboardComponent/MonthlyLeaderboardTable';
import WeeklyLeaderboardTable from './DashboardComponent/WeeklyLeaderboardTable';
import DashboardStats from './DashboardComponent/DashboardStats';
import TermsAndCondition from './DashboardComponent/TermsAndCondition';
import AdminDashboard from './DashboardComponent/AdminDashboard';

export default function Dashboard({ cumulative, monthly, weekly, facultyRanking, current_user, isAdmin, cumulativeAll, monthlyAll, 
    weeklyAll, transactions, last_week, last_month, total_nov_count, total_dec_count, total_cumulative_count,
    campusDistribution, monthlyTransactions, lineChartData, total_users, total_transactions,
    transactionTypeCounts }) {
    
    return (
        <AuthenticatedLayout
            isAdmin={isAdmin}
            header={!isAdmin ? <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                : <h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Dashboard" />
            {/* {!isAdmin
            ?
            (
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className='bg-white rounded-lg shadow p-4 sm:p-4 mt-2 text-center mb-8'>
                        <p className="text-green-500 font-bold text-lg">
                            🎄 The DuitNow Challenge Event Has Ended! 🎄
                        </p>
                        <p className="text-gray-700 font-medium mt-2">
                            Thank you for participating! Stay tuned for upcoming events and announcements.
                        </p>
                    </div>

                    <div>
                        <h1>Total November Count: {total_nov_count}</h1>
                        <h1>Total December Count: {total_dec_count}</h1>
                        <h1>Total Cumulative Count: {total_cumulative_count}</h1>
                    </div> */}

                    {/* <DashboardStats current_user={current_user} cumulative={cumulativeAll} weekly={weeklyAll} monthly={monthlyAll}/> */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"> */}
                        {/* Leaderboard tables wrapped with responsive classes */}
                        {/* <div className='flex-1 bg-white rounded-lg shadow p-8'>
                            <WeeklyLeaderboardTable
                                users={last_week.data}
                                links={last_week.links}
                                current_user={current_user}
                                isAdmin={isAdmin}
                                selectedNumber={10}
                                selectedTime={0}
                                weeklyAll={weeklyAll}
                            />
                        </div>

                        <div className='flex-1 bg-white rounded-lg shadow p-8'>
                            <MonthlyLeaderboardTable
                                users={last_month.data}
                                links={last_month.links}
                                current_user={current_user}
                                isAdmin={isAdmin}
                                selectedNumber={10}
                                selectedTime={0}
                                monthlyAll={monthlyAll}
                            />
                        </div>

                        <div className='flex-1 bg-white rounded-lg shadow p-8 md:col-span-2 lg:col-span-1'>
                            <CumulativeLeaderboardTable
                                users={cumulative.data}
                                title="Cumulative Top 10"
                                duration="November 10th, 2024 (12:00 a.m) - December 28th, 2024 (11:59 p.m)"
                                current_user={current_user}
                                isAdmin={isAdmin}
                                links={cumulative.links}
                                selectedNumber={10}
                                cumulativeAll={cumulativeAll}
                            />
                        </div>
                    </div> */}

                    {/* <div className='bg-white rounded-lg shadow p-4 sm:p-4 mt-6 text-center'>
                        <TermsAndCondition />
                    </div> */}
                {/* </div>
            )
            :
            ( */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
                <DashboardStats 
                    total_users={total_users} 
                    total_transactions={total_transactions} 
                />
            </div>

                <AdminDashboard 
                current_user={current_user} 
                cumulative={cumulative} 
                facultyRanking={facultyRanking} 
                weekly={last_week} 
                monthly={last_month} 
                isAdmin={isAdmin} 
                weeklyAll={weeklyAll} 
                monthlyAll={monthlyAll} 
                cumulativeAll={cumulativeAll} 
                transactions={transactions}
                total_nov_count = {total_nov_count} 
                total_dec_count = {total_dec_count}
                total_cumulative_count = {total_cumulative_count}
                campusDistribution = {campusDistribution}
                monthlyTransactions = {monthlyTransactions}
                lineChartData = {lineChartData}
                transactionTypeCounts={transactionTypeCounts} />
                
            {/* )} */}
        </AuthenticatedLayout>
    );
}
