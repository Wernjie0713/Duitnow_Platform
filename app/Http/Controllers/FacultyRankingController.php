<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FacultyRankingController extends Controller
{
    public function export()
    {
        $data = DB::table('users')
            ->join('transactions', 'users.id', '=', 'transactions.user_id')
            ->select('users.faculty', DB::raw('COUNT(transactions.id) as transaction_count'))
            ->groupBy('users.faculty')
            ->orderByDesc('transaction_count')
            ->get();

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Faculty', 'Transaction Count']);

            foreach ($data as $row) {
                fputcsv($file, [$row->faculty, $row->transaction_count]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="faculty_ranking.csv"',
        ]);
    }
}