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
  import { Button } from "@/Components/ui/button";

const FacultyRankingTable = ({ faculties }) => {
    const handleExport = () => {
        window.location.href = route('export.faculty-ranking');
    };

    return (
        <div className="space-y-6">
            <div className="relative flex flex-col sm:flex-row items-center justify-between pt-4 pb-2">
                {/* Spacer */}
                <div className="sm:w-1/4 mb-4 sm:mb-0"></div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center whitespace-nowrap">
                    Faculty Ranking by Total Transactions
                </h1>

                {/* Export Button for Admin */}
                <div className="sm:w-1/4 flex justify-end mt-4 sm:mt-0">
                    <Button onClick={handleExport}>
                        Export to Excel
                    </Button>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black">
                            <TableHead className="w-[5%] text-center font-semibold text-white">No.</TableHead>
                            <TableHead className="w-[80%] font-semibold text-white">Faculty</TableHead>
                            <TableHead className="w-[15%] text-center font-semibold text-white">Total Transactions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {faculties.map((faculty, index) => (
                            <TableRow key={faculty.faculty} className={`hover:bg-gray-100 transition-colors duration-200`}>
                                <TableCell className="font-medium text-center">{index + 1}.</TableCell>
                                <TableCell>{faculty.faculty}</TableCell>
                                <TableCell className="text-center">{faculty.transaction_count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default FacultyRankingTable;