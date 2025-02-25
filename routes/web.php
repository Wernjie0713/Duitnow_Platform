<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\ProfileCompletionController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Carbon;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Http\Request;
use App\Http\Controllers\FacultyRankingController;
use App\Http\Controllers\ContactUsController;
use App\Models\Transaction;


Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canRegister' => Route::has('register'),
        'canResetPassword' => Route::has('password.request'),
    ]);
});

Route::get('/faculty-ranking', [DashboardController::class, 'getFacultyRanking'])->name('faculty.ranking');
Route::get('/export/faculty-ranking', [FacultyRankingController::class, 'export'])->name('export.faculty-ranking');
Route::get('/export/cumulative-leaderboard', [DashboardController::class, 'exportCumulativeLeaderboard'])->name('export.cumulative-leaderboard');
Route::get('/export/weekly-leaderboard', [DashboardController::class, 'exportWeeklyLeaderboard'])->name('export.weekly-leaderboard');
Route::get('/export/monthly-leaderboard', [DashboardController::class, 'exportMonthlyLeaderboard'])->name('export.monthly-leaderboard');
Route::get('/export/transactions', [DashboardController::class, 'exportTransactions'])->name('export.transactions');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/complete-profile', [ProfileCompletionController::class, 'show'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileCompletionController::class, 'update']);

    Route::get('/dashboard', function (Request $request) {
        if (!Auth::user()->is_profile_complete) {
            return redirect()->route('profile.complete');
        }

        // Get the current month
        $currentMonth = Carbon::now()->format('M'); // Format the month as a 3-letter abbreviation, e.g., 'Oct'
        
        // Determine which column to order by based on the current month
        $monthlyOrderColumn = match($currentMonth) {
            'Nov' => 'nov_count',
            'Dec' => 'dec_count',
            default => 'total_count', // Fallback to total_count if it's not within Oct-Dec
        };

        // Event start and end dates
        $eventStartDate = Carbon::create(2024, 11, 10); // 10th November 2024
        $eventEndDate = Carbon::create(2024, 12, 31);  // 31st December 2024
        $currentDate = Carbon::now();
        // $currentDate = Carbon::create(2024, 11, 12);
        if ($currentDate->between($eventStartDate, $eventEndDate)) {
            // Calculate the number of days since the start of the event
            $daysSinceEventStart = $eventStartDate->diffInDays($currentDate);

            // Calculate week number (1-based)
            $weekNumber = ceil(($daysSinceEventStart + 1) / 7);

            // Ensure the week number is valid (1-8)
            if ($weekNumber >= 1 && $weekNumber <= 8) {
                $weekColumn = 'week' . $weekNumber . '_count'; // e.g., week1_count, week2_count, etc.
            }
        }

        $dashboardController = new DashboardController();
        $facultyRanking = $dashboardController->getFacultyRanking()->getData();

        $allRelevantUsers = User::where('id', '!=', 1)
        ->where('is_profile_complete', true)
        ->get();

        $totalNovCount       = $allRelevantUsers->sum('nov_count');      // *** ADDED
        $totalDecCount       = $allRelevantUsers->sum('dec_count');      // *** ADDED
        $totalCumulativeCount= $allRelevantUsers->sum('total_count');    // *** ADDED

        $skudaiCount = User::where('campus', 'UTM JOHOR BAHRU')->count();
        $klCount     = User::where('campus', 'UTM KUALA LUMPUR')->count();
        $pagohCount  = User::where('campus', 'UTM PAGOH')->count();

        $novCount = Transaction::whereBetween('date', ['2024-11-01', '2024-11-30'])->count();
        $decCount = Transaction::whereBetween('date', ['2024-12-01', '2024-12-31'])->count();

        $topWinners = User::orderBy('total_count', 'desc')
                    ->take(10)
                    ->get();
                    $trendData = [];
        foreach ($topWinners as $user) {
            // Group by date, e.g. for Nov 10 to Dec 31, 2024
            $userTransactions = Transaction::selectRaw('date, count(*) as total')
                ->where('user_id', $user->id)
                ->whereBetween('date', ['2024-11-01', '2024-12-31'])
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $trendData[] = [
                'user_id' => $user->id,
                'name'    => $user->name,
                'data'    => $userTransactions, 
            ];
        }

        return Inertia::render('Dashboard', [
            'cumulative' => User::where('id', '!=', 1)
                    ->where('is_profile_complete', true)
                    ->orderBy('total_count', 'desc')
                    ->orderBy('name', 'asc')
                    ->paginate(10)->lazy(),

            // 'monthly' => User::where('id', '!=', 1)
            //                 ->where('is_profile_complete', true)
            //                 ->orderBy($monthlyOrderColumn, 'desc')
            //                 ->orderBy('name', 'asc')
            //                 ->paginate(10),

            'last_month' => User::where('id', '!=', 1)
                            ->where('is_profile_complete', true)
                            ->orderBy('dec_count', 'desc')
                            ->orderBy('name', 'asc')
                            ->paginate(10)->lazy(),

            // 'weekly' => User::where('id', '!=', 1)
            //                 ->where('is_profile_complete', true)
            //                 ->orderBy($weekColumn, 'desc')
            //                 ->orderBy('name', 'asc')
            //                 ->paginate(10),

            'last_week' => User::where('id', '!=', 1)
                            ->where('is_profile_complete', true)
                            ->orderBy('week7_count', 'desc')
                            ->orderBy('name', 'asc')
                            ->paginate(10)->lazy(),
                            

            'cumulativeAll' => User::where('id', '!=', 1)
                                ->where('is_profile_complete', true)
                                ->orderBy('total_count', 'desc')
                                ->orderBy('name', 'asc')
                                ->get()->lazy(),

            'monthlyAll' => User::where('id', '!=', 1)
                                ->where('is_profile_complete', true)
                                ->orderBy('dec_count', 'desc')
                                ->orderBy('name', 'asc')
                                ->get()->lazy(),

            'weeklyAll' => User::where('id', '!=', 1)
                            ->where('is_profile_complete', true)
                            ->orderBy('week7_count', 'desc')
                            ->orderBy('name', 'asc')
                            ->get()->lazy(),
                            
            'current_user' => Auth::user(),
            'isAdmin' => BouncerFacade::is(Auth::user())->an('admin'),
            'facultyRanking' => $facultyRanking,
            'transactions' => Transaction::with('user')
                ->orderBy('id', 'desc')
                ->paginate(10),
            'total_nov_count'       => $totalNovCount,
            'total_dec_count'       => $totalDecCount,
            'total_cumulative_count'=> $totalCumulativeCount,
            'campusDistribution' => [
                'skudai' => $skudaiCount,
                'kl'     => $klCount,
                'pagoh'  => $pagohCount,
            ],
            'monthlyTransactions' => [
                'nov' => $novCount,
                'dec' => $decCount,
            ],
            'lineChartData' => $trendData,
        ]);
    })->name('dashboard');
});

Route::middleware('auth', 'can:edit-profile')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Define the resource route for transactions (index and store only)
// Route::resource('transactions', TransactionController::class)
//     ->only(['index', 'store'])
//     ->middleware(['auth', 'verified', 'can:manage-transactions']);

// // Add a separate route for showing the extracted text (confirmation page)
// Route::get('/transactions/show', [TransactionController::class, 'show'])
//     ->name('transactions.show')
//     ->middleware(['auth', 'verified', 'can:manage-transactions']);

// // Add POST route to save confirmed transaction data
// Route::post('/transactions/confirm', [TransactionController::class, 'confirm'])
//     ->name('transactions.confirm')
//     ->middleware(['auth', 'verified', 'can:manage-transactions']);

Route::resource('contactus', ContactUsController::class)
->only(['index', 'store'])
->middleware(['auth', 'verified']); 

Route::post('/contactus/{contactUs}/comments', [ContactUsController::class, 'storeComment'])
    ->name('contactus.comments.store')
    ->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';
