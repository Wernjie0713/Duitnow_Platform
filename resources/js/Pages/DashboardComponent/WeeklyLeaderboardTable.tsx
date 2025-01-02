import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table";
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { Button } from "@/Components/ui/button";
  
export default function WeeklyLeaderboardTable({ users, current_user, isAdmin, selectedNumber, links, selectedTime, weeklyAll }) {
    if (!users || users.length === 0) {
        return (
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black">
                            <TableHead className="w-[30%] font-semibold text-white">No.</TableHead>
                            <TableHead className="w-[30%] font-semibold text-white">Name</TableHead>
                            <TableHead className="w-[25%] font-semibold text-white">Transaction Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow></TableRow>
                        <TableCell>No users found.</TableCell>
                    </TableBody>
                </Table>
            </div>
        );
    }

    const [weeklyCount, setWeeklyCount] = useState<string>('total_count');
    const [weeklyDuration, setWeeklyDuration] = useState<string>('');
    const [weeklyTitle, setWeeklyTitle] = useState<string>('');

    // Get the current month in JavaScript
    useEffect(() => {
        const currentDate = dayjs('2024-12-28');
        // const currentDate = dayjs('2024-11-12');

        // Event start and end dates
        const eventStartDate = dayjs('2024-11-10'); // 10th November 2024
        const eventEndDate= dayjs('2024-12-31');  // 31st December 2024

        if (currentDate.isBetween(eventStartDate, eventEndDate, null, '[]')) {
            // Calculate the number of days since the start of the event
            const daysSinceEventStart = currentDate.diff(eventStartDate, 'day');

            // Calculate week number (1-based)
            // let weekNumber = Math.ceil((daysSinceEventStart + 1) / 7);
            let weekNumber = Math.ceil((daysSinceEventStart + 1) / 7);

            // Ensure the week number is valid (1-8)
            if (weekNumber >= 1 && weekNumber <= 8) {
                setWeeklyCount(`week${weekNumber}_count`);

                const duration = (() => {
                    switch (weekNumber) {
                        case 1:
                            return 'November 10th, 2024 (12:00 a.m) - November 16th, 2024 (11:59 p.m)';
                        case 2:
                            return 'November 17th, 2024 (12:00 a.m) - November 23th, 2024 (11:59 p.m)';
                        case 3:
                            return 'November 24th, 2024 (12:00 a.m) - November 30th, 2024 (11:59 p.m)';
                        case 4:
                            return 'December 1st, 2024 (12:00 a.m) - December 7th, 2024 (11:59 p.m)';
                        case 5:
                            return 'December 8th, 2024 (12:00 a.m) - December 14th, 2024 (11:59 p.m)';
                        case 6:
                            return 'December 15th, 2024 (12:00 a.m) - December 21th, 2024 (11:59 p.m)';
                        case 7:
                            return 'December 22th, 2024 (12:00 a.m) - December 28th, 2024 (11:59 p.m)';
                        case 8:
                            return 'December 29th, 2024 (12:00 a.m) - December 31th, 2024 (11:59 p.m)';
                        default:
                            return 'September 1st, 2024 (12:00 a.m) - September 30th, 2024 (11:59 p.m)'; // Default fallback
                    }
                })();

                const title = (() => {
                    switch (weekNumber) {
                        case 1:
                            return 'Week 1 Top 10';
                        case 2:
                            return 'Week 2 Top 10';
                        case 3:
                            return 'Week 3 Top 10';
                        case 4:
                            return 'Week 4 Top 10';
                        case 5:
                            return 'Week 5 Top 10';
                        case 6:
                            return 'Week 6 Top 10';
                        case 7:
                            return 'Week 7 Top 10';
                        case 8:
                            return 'Week 8 Top 10';
                        default:
                            return 'Week 0 Top 10'; // Default fallback
                    }
                    
                })();

                setWeeklyDuration(duration);
                setWeeklyTitle(title);
            }
        }
        else{
            const duration = 'September 1st, 2024 (12:00 a.m) - September 30th, 2024 (11:59 p.m)'; // Default fallback
            const title = 'Week 0 Top 10'; // Default fallback
            setWeeklyDuration(duration);
            setWeeklyTitle(title);
        }
    }, []);

    useEffect(() => {
        if (selectedTime !== 0) {
            // Ensure the week number is valid (1-13)
            if (selectedTime >= 1 && selectedTime <= 13) {
                setWeeklyCount(`week${selectedTime}_count`);

                const duration = (() => {
                    switch (selectedTime) {
                        case 1:
                            return 'November 10th, 2024 (12:00 a.m) - November 16th, 2024 (11:59 p.m)';
                        case 2:
                            return 'November 17th, 2024 (12:00 a.m) - November 23th, 2024 (11:59 p.m)';
                        case 3:
                            return 'November 24th, 2024 (12:00 a.m) - November 30th, 2024 (11:59 p.m)';
                        case 4:
                            return 'December 1st, 2024 (12:00 a.m) - December 7th, 2024 (11:59 p.m)';
                        case 5:
                            return 'December 8th, 2024 (12:00 a.m) - December 14th, 2024 (11:59 p.m)';
                        case 6:
                            return 'December 15th, 2024 (12:00 a.m) - December 21th, 2024 (11:59 p.m)';
                        case 7:
                            return 'December 22th, 2024 (12:00 a.m) - December 28th, 2024 (11:59 p.m)';
                        case 8:
                            return 'December 29th, 2024 (12:00 a.m) - December 31th, 2024 (11:59 p.m)';
                        default:
                            return 'September 1st, 2024 (12:00 a.m) - September 30th, 2024 (11:59 p.m)'; // Default fallback
                    }
                })();

                const title = (() => {
                    switch (selectedTime) {
                        case 1:
                            return 'Week 1 Top 10';
                        case 2:
                            return 'Week 2 Top 10';
                        case 3:
                            return 'Week 3 Top 10';
                        case 4:
                            return 'Week 4 Top 10';
                        case 5:
                            return 'Week 5 Top 10';
                        case 6:
                            return 'Week 6 Top 10';
                        case 7:
                            return 'Week 7 Top 10';
                        case 8:
                            return 'Week 8 Top 10';
                        default:
                            return 'Week 0 Top 10'; // Default fallback
                    }
                })();

                setWeeklyDuration(duration);
                setWeeklyTitle(title);
            }
        }
    }, [selectedTime]);

    const Rank = weeklyAll.findIndex((user) => user.id === current_user.id) + 1
    console.log(Rank);

    // Add a new state to keep track of the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Update currentPage when links change
    useEffect(() => {
        if (links && links.length > 0) {
            const currentPageLink = links.find(link => link.active);
            if (currentPageLink) {
                setCurrentPage(parseInt(currentPageLink.label));
            }
        }
    }, [links]);

    // Calculate the starting index for the current page
    const startIndex = (currentPage - 1) * 10;

    // Function to handle CSV export
    const handleExport = () => {
        // Append the selected week to the URL for export
        window.location.href = route('export.weekly-leaderboard', { week: selectedTime });
    };

    return (
        <div className="space-y-6">
            <div className="relative flex flex-col sm:flex-row items-center justify-between pt-4 pb-2">
                {/* Spacer */}
                <div className="sm:w-1/4 mb-4 sm:mb-0"></div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center whitespace-nowrap">
                    {selectedNumber !== 10 ? `${weeklyTitle}0` : weeklyTitle}
                </h1>

                {!isAdmin && (
                    <div className="sm:w-1/4 mb-4 sm:mb-0"></div>
                )}

                {/* Export Button for Admin */}
                {isAdmin && (
                    <div className="sm:w-1/4 flex justify-end mt-4 sm:mt-0">
                        <Button onClick={handleExport}>
                            Export to Excel
                        </Button>
                    </div>
                )}
            </div>


            <div className="text-center pb-4">
                <p className="text-gray-600">
                    <span className="font-medium">{weeklyDuration}</span>
                </p>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black">
                            <TableHead className="w-[5%] text-center font-semibold text-white">No.</TableHead>
                            <TableHead className="w-[30%] font-semibold text-white">Name</TableHead>
                            {isAdmin && (
                                <>
                                    <TableHead className="w-[20%] font-semibold text-white">Email</TableHead>
                                    <TableHead className="w-[10%] font-semibold text-white">Matric No.</TableHead>
                                    <TableHead className="w-[15%] font-semibold text-white">DuitNow ID</TableHead>
                                    <TableHead className="w-[15%] font-semibold text-white">Phone No.</TableHead>
                                    <TableHead className="w-[10%] font-semibold text-white">Faculty</TableHead>
                                    <TableHead className="w-[10%] font-semibold text-white">Campus</TableHead>
                                </>
                            )}
                            <TableHead className="w-[10%] text-center font-semibold text-white">Transaction Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.slice(0, 10).map((user, index) => (
                            <TableRow key={user.id} className={`hover:bg-gray-100 transition-colors duration-200 ${user.id === current_user.id ? 'bg-gray-200' : ''}`}>
                                <TableCell className={`text-center font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{startIndex + index + 1}.</TableCell>
                                <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.name}</TableCell>
                                {isAdmin && (
                                    <>
                                        <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.email}</TableCell>
                                        <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.matric_no}</TableCell>
                                        <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.duitnow_id}</TableCell>
                                        <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.phone_no}</TableCell>
                                        <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.faculty}</TableCell>
                                        <TableCell className={`font-normal ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user.campus}</TableCell>
                                    </>
                                )}
                                <TableCell className={`font-normal text-center ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user[weeklyCount]}</TableCell>
                            </TableRow>
                        ))}
                        {!isAdmin &&
                        !users.slice(0, 10).some(user => user.id === current_user.id) && (
                                <TableRow key={current_user.id} className="hover:bg-gray-100 transition-colors duration-200 bg-gray-200">
                                    <TableCell className="text-center font-normal text-black font-black">{Rank}.</TableCell>
                                    <TableCell className="font-normal text-black font-black">{current_user.name}</TableCell>
                                    <TableCell className="font-normal text-center text-black font-black">{current_user[weeklyCount]}</TableCell>
                                </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedNumber !== 10 && links && links.length > 0 && (
                <div className="flex justify-center mt-6">
                    <nav aria-label="Page navigation">
                        <ul className="inline-flex rounded-md shadow-sm">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.url}
                                        className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border ${
                                            index === 0 ? 'rounded-l-md' : ''
                                        } ${
                                            index === links.length - 1 ? 'rounded-r-md' : ''
                                        } ${
                                            link.active
                                                ? 'bg-black text-white border-gray-500 hover:bg-black hover:text-white'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}