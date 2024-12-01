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
import { Button } from '@/Components/ui/button';

export default function MonthlyLeaderboardTable({ users, current_user, isAdmin, selectedNumber, links, selectedTime, monthlyAll }) {
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

    const [monthlyCount, setMonthlyCount] = useState<string>('total_count');
    const [monthlyDuration, setMonthlyDuration] = useState<string>('');
    const [monthlyTitle, setMonthlyTitle] = useState<string>('');

    // Get the current month in JavaScript
    useEffect(() => {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }); // "Oct", "Nov", "Dec"

        // Map the current month to the corresponding database column
        const column = (() => {
            switch (currentMonth) {
                case 'Nov':
                    return 'nov_count';
                case 'Dec':
                    return 'dec_count';
                default:
                    return 'total_count'; // Default fallback
            }

        })();

        const duration = (() => {
            switch (currentMonth) {
                case 'Nov':
                    return 'November 1st, 2024 (12:00 a.m) - November 30th, 2024 (11:59 p.m)';
                case 'Dec':
                    return 'December 1st, 2024 (12:00 a.m) - December 31th, 2024 (11:59 p.m)';
                default:
                    return 'September 1st, 2024 (12:00 a.m) - September 30th, 2024 (11:59 p.m)'; // Default fallback
            }

        })();

        const title = (() => {
            switch (currentMonth) {
                case 'Nov':
                    return 'November Top 10';
                case 'Dec':
                    return 'December Top 10';
                default:
                    return 'September Top 10'; // Default fallback
            }

        })();

        setMonthlyCount(column);
        setMonthlyDuration(duration);
        setMonthlyTitle(title);
    }, []);

    useEffect(() => {
        if (selectedTime !== 0) {
            // Ensure the week number is valid (1-13)
            const column = (() => {
                switch (selectedTime) {
                    case 11:
                        return 'nov_count';
                    case 12:
                        return 'dec_count';
                    default:
                        return 'oct_count'; // Default fallback
                }

            })();

            const duration = (() => {
                switch (selectedTime) {
                    case 11:
                        return 'November 1st, 2024 (12:00 a.m) - November 30th, 2024 (11:59 p.m)';
                    case 12:
                        return 'December 1st, 2024 (12:00 a.m) - December 31th, 2024 (11:59 p.m)';
                    default:
                        return 'October 6th, 2024 (12:00 a.m) - October 31th, 2024 (11:59 p.m)'; // Default fallback
                }

            })();

            const title = (() => {
                switch (selectedTime) {
                    case 11:
                        return 'November Top 10';
                    case 12:
                        return 'December Top 10';
                    default:
                        return 'October Top 10'; // Default fallback
                }

            })();

            setMonthlyCount(column);
            setMonthlyDuration(duration);
            setMonthlyTitle(title);
        }
    }, [selectedTime]);

    const Rank = monthlyAll.findIndex((user) => user.id === current_user.id) + 1

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

    const selectedMonth = (() => {
        switch (selectedTime) {
            case 11:
                return 'nov';
            case 12:
                return 'dec';
        }
    })();

    // Function to handle CSV export
    const handleExport = () => {
        // Append the selected week to the URL for export
        window.location.href = route('export.monthly-leaderboard', { month: selectedMonth });
    };

    return (
        <div className="space-y-6">
           <div className="relative flex flex-col sm:flex-row items-center justify-between pt-4 pb-2">
                {/* Spacer */}
                <div className="sm:w-1/4 mb-4 sm:mb-0"></div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center whitespace-nowrap">
                    {selectedNumber !== 10 ? `${monthlyTitle}0` : monthlyTitle}
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
                    <span className="font-medium">{monthlyDuration}</span>
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
                                <TableCell className={`font-normal text-center ${user.id === current_user.id ? 'text-black font-black' : ''}`}>{user[monthlyCount]}</TableCell>
                            </TableRow>
                        ))}
                        {!isAdmin &&
                        !users.slice(0, 10).some(user => user.id === current_user.id) && (
                            <TableRow key={current_user.id} className="hover:bg-gray-100 transition-colors duration-200 bg-gray-200">
                                <TableCell className="text-center font-normal text-black font-black">{Rank}.</TableCell>
                                <TableCell className="font-normal text-black font-black">{current_user.name}</TableCell>
                                <TableCell className="font-normal text-center text-black font-black">{current_user[monthlyCount]}</TableCell>
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
