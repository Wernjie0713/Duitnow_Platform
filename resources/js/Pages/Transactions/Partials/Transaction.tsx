import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Transaction({ transactions, links }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black">
                            <TableHead className="w-[30%] font-semibold text-white">Reference No.</TableHead>
                            <TableHead className="w-[25%] font-semibold text-white">Date</TableHead>
                            <TableHead className="w-[15%] font-semibold text-white">Amount (RM)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow></TableRow>
                        <TableCell>No transactions found.</TableCell>
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black">
                            <TableHead className="w-[30%] font-semibold text-white">Reference No.</TableHead>
                            <TableHead className="w-[25%] font-semibold text-white">Date</TableHead>
                            <TableHead className="w-[15%] font-semibold text-white text-center">Amount (RM)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <TableCell className="font-medium text-blue-600">{transaction.reference_id}</TableCell>
                                <TableCell>{transaction.date ? format(new Date(transaction.date), 'PPP') : 'N/A'}</TableCell>
                                <TableCell className="font-semibold text-center">{transaction.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {links && links.length > 0 && (
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
