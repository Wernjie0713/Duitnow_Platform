import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head } from '@inertiajs/react';
import CumulativeLeaderboardTable from './DashboardComponent/CumulativeLeaderboardTable';
import MonthlyLeaderboardTable from './DashboardComponent/MonthlyLeaderboardTable';
import WeeklyLeaderboardTable from './DashboardComponent/WeeklyLeaderboardTable';
import DashboardStats from './DashboardComponent/DashboardStats';
import TermsAndCondition from './DashboardComponent/TermsAndCondition';
import AdminDashboard from './DashboardComponent/AdminDashboard';

export default function Dashboard({ cumulative, monthly, weekly, facultyRanking, current_user, isAdmin, cumulativeAll, monthlyAll, weeklyAll, transactions }) {
    return (
        <AuthenticatedLayout
            isAdmin={isAdmin}
            header={!isAdmin ? <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                : <h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Dashboard" />
            {!isAdmin
            ?
            (
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className='bg-white rounded-lg shadow p-4 sm:p-4 mt-2 text-center mb-8'>
                        <p className="text-green-500 font-bold text-lg">
                            🎄 December Ranking Event is Here! 🎄
                        </p>
                        <p className="text-gray-700 font-medium mt-2">
                            Compete every week to climb the ranks and win exciting prizes! 🎉
                        </p>
                        <p className="text-gray-700 font-medium mt-2">
                            <strong>Event Duration:</strong> Refer to the Weekly Ranking Table for specific weeks.
                        </p>
                        <p className="text-gray-700 font-medium mt-2">
                            <strong>Prizes:</strong> Weekly Top 10 users will win rewards! Note: Prizes differ from November Monthly Ranking rewards. 🎁
                        </p>
                        <p className="text-gray-700 font-medium mt-2">
                            <strong>Eligibility:</strong> Minimum <span className="text-blue-600 font-semibold">80 transactions</span> for Top 3 positions, and <span className="text-blue-600 font-semibold">40 transactions</span> for Top 10 positions.
                        </p>
                        <p className="text-gray-700 font-medium mt-2">
                            <strong className='text-red-900'>Rule updated:</strong> 
                            - Weekly Top 3 winners must aim for a <strong>higher position</strong> or 4 to 10 in subsequent weeks. <br />
                            - Top 1 can only win once in the event and will qualify for 4 to 10 prizes in subsequent weeks.
                        </p>
                        <p className="text-sm mt-4 text-blue-600">
                            For more details, please refer to the <TermsAndCondition />
                        </p>
                    </div>


                    <DashboardStats current_user={current_user} cumulative={cumulativeAll} weekly={weeklyAll} monthly={monthlyAll}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {/* Leaderboard tables wrapped with responsive classes */}
                        <div className='flex-1 bg-white rounded-lg shadow p-8'>
                            <WeeklyLeaderboardTable
                                users={weekly.data}
                                links={weekly.links}
                                current_user={current_user}
                                isAdmin={isAdmin}
                                selectedNumber={10}
                                selectedTime={0}
                                weeklyAll={weeklyAll}
                            />
                        </div>

                        <div className='flex-1 bg-white rounded-lg shadow p-8'>
                            <MonthlyLeaderboardTable
                                users={monthly.data}
                                links={monthly.links}
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
                                duration="November 10th, 2024 (12:00 a.m) - December 31th, 2024 (11:59 p.m)"
                                current_user={current_user}
                                isAdmin={isAdmin}
                                links={cumulative.links}
                                selectedNumber={10}
                                cumulativeAll={cumulativeAll}
                            />
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow p-4 sm:p-4 mt-6 text-center'>
                        <TermsAndCondition />
                    </div>
                </div>
            )
            :
            (
                <AdminDashboard current_user={current_user} cumulative={cumulative} facultyRanking={facultyRanking} weekly={weekly} monthly={monthly} isAdmin={isAdmin} weeklyAll={weeklyAll} monthlyAll={monthlyAll} cumulativeAll={cumulativeAll} transactions={transactions} />
            )}
        </AuthenticatedLayout>
    );
}
