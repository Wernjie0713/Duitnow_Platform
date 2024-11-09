<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Models\User;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function getFacultyRanking()
    {
        $facultyRanking = DB::table('users')
            ->join('transactions', 'users.id', '=', 'transactions.user_id')
            ->select('users.faculty', DB::raw('COUNT(transactions.id) as transaction_count'))
            ->groupBy('users.faculty')
            ->orderByDesc('transaction_count')
            ->get();

        return response()->json($facultyRanking);
    }

     // Export Cumulative Leaderboard
    public function exportCumulativeLeaderboard()
    {
        $data = DB::table('users')
            ->where('id', '!=', 1) // Exclude the admin or specific user with id 1
            ->orderBy('total_count', 'desc')
            ->select('name', 'email', 'matric_no', 'duitnow_id', 'phone_no', 'faculty', 'campus', 'total_count')
            ->get();

        return $this->streamCSV($data, 'cumulative_leaderboard.csv', ['Name', 'Email', 'Matric No', 'Phone No.', 'DuitNow ID', 'Faculty', 'Campus', 'Transaction Count']);
    }
 
    public function exportWeeklyLeaderboard(Request $request)
    {
        try {
            $selectedWeek = $request->input('week');
            $weekColumn = 'week' . $selectedWeek . '_count';

            $data = User::whereNot('id', 1)
                ->select('name', 'email', 'matric_no', 'duitnow_id', 'phone_no', 'faculty', 'campus', $weekColumn)
                ->orderByDesc($weekColumn)
                ->get();

            $callback = function() use ($data, $weekColumn) {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Name', 'Email', 'Matric No', 'Phone No.', 'DuitNow ID', 'Faculty', 'Campus', 'Transaction Count']);

                foreach ($data as $row) {
                    fputcsv($file, [$row->name, $row->email, $row->matric_no, $row->duitnow_id, $row->phone_no, $row->faculty, $row->campus, $row->$weekColumn]);
                }

                fclose($file);
            };

            return Response::streamDownload($callback, 'week'.$selectedWeek.'.csv', [
                'Content-Type' => 'text/csv',
            ]);
        } catch (\Exception $e) {
            \Log::error('Export failed: ' . $e->getMessage());
            return response()->json(['error' => 'Export failed. Please check the logs.'], 500);
        }
    }
 
     // Export Monthly Leaderboard
     public function exportMonthlyLeaderboard(Request $request)
     {
        try {
            $selectedMonth = $request->input('month');
            $monthColumn = $selectedMonth . '_count';
    
            $data = User::whereNot('id', 1)
                ->select('name', 'email', 'matric_no', 'duitnow_id', 'phone_no', 'faculty', 'campus', $monthColumn)
                ->orderByDesc($monthColumn)
                ->get();

            $callback = function() use ($data, $monthColumn) {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Name', 'Email', 'Matric No', 'DuitNow ID', 'Phone No.', 'Faculty', 'Campus', 'Transaction Count']);

                foreach ($data as $row) {
                    fputcsv($file, [$row->name, $row->email, $row->matric_no, $row->duitnow_id, $row->phone_no, $row->faculty, $row->campus, $row->$monthColumn]);
                }

                fclose($file);
            };

            return Response::streamDownload($callback, $monthColumn.'.csv', [
                'Content-Type' => 'text/csv',
            ]);
        } catch (\Exception $e) {
            \Log::error('Export failed: ' . $e->getMessage());
            return response()->json(['error' => 'Export failed. Please check the logs.'], 500);
        }
     }
 
     // Helper function to stream CSV
     private function streamCSV($data, $filename, $headers)
     {
         $callback = function() use ($data, $headers) {
             $file = fopen('php://output', 'w');
             fputcsv($file, $headers); // CSV headers
 
             foreach ($data as $row) {
                 fputcsv($file, (array) $row); // Convert object to array
             }
 
             fclose($file);
         };
 
         return new StreamedResponse($callback, 200, [
             'Content-Type' => 'text/csv',
             'Content-Disposition' => 'attachment; filename="' . $filename . '"',
         ]);
     }
}