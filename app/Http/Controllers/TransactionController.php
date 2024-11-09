<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use thiagoalessio\TesseractOCR\TesseractOCR;
use DateTime; // Import DateTime from the global namespace
use Exception; // Import Exception from the global namespace
use Silber\Bouncer\BouncerFacade;


class TransactionController extends Controller
{
    public function index(): Response
    {
        if(Auth::user()->cannot('manage-transactions'))
        {
            abort(403, 'Unauthorized access.');                       
        }
        else{
            return Inertia::render('Transactions/Index',[
                'transactions' => Transaction::with('user')
                ->where('user_id', Auth::id())
                ->latest()
                ->paginate(10),
                'isAdmin' => BouncerFacade::is(Auth::user())->an('admin'),
            ]);
        }
    }

    public function confirm(Request $request)
    {
        // Validate the confirmed data
        $request->validate([
            'reference_id' => 'required|string|unique:transactions,reference_id|max:50',
            'date' => 'required|date|after_or_equal:2024-11-10|before_or_equal:today',
            // 'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01|max:999999.99',
        ]);

        // Create and save a new transaction using the confirmed data
        $transaction = new Transaction();
        $transaction->user_id = Auth::id(); // Authenticated user
        $transaction->reference_id = $request->reference_id;
        $transaction->date = $request->date;
        $transaction->amount = $request->amount;
        
        // Save the transaction to the database
        $transaction->save();

        // Update the user's transaction counts
        try {
            $this->updateUserCounts($transaction); // Call the function here
        } catch (ValidationException $e) {
            // If there's an issue with updating counts, delete the transaction and re-throw the exception
            $transaction->delete();
            throw $e;
        }

        // Redirect the user back to the transactions index or another page
        return redirect()->route('transactions.index')->with('success', 'Transaction confirmed and saved successfully!');
    }

    public function store(Request $request)
    {
        // Validate the uploaded image
        $request->validate([
            'image_url' => 'required|file|mimes:jpeg,png,jpg|max:2048', // Ensure it's an image
        ]);

        // Handle the image file if uploaded
        if ($request->hasFile('image_url')) {
            $imagePath = $request->file('image_url')->store('transactions', 'public'); // Store the image

            // Full path to the uploaded image
            $imageFullPath = storage_path('app/public/' . $imagePath);

            // Use Tesseract OCR to extract text from the image
            $extractedText = (new TesseractOCR($imageFullPath))->run();

            // Continue with existing extraction...
            $reference_id = $this->extractReferenceID($extractedText);
            $date = $this->extractDate($extractedText);
            $amount = $this->extractAmount($extractedText);

            // Log the full extracted text for debugging purposes
            logger()->info('Extracted Text:', ['text' => $extractedText]);
            
            logger()->info('Extracted Data:', [
                'reference_id' => $reference_id,
                'date' => $date,
                'amount' => $amount,
            ]);

            return redirect()->route('transactions.show')
                            ->with([
                                'reference_id' => $reference_id,
                                'date' => $date,
                                'amount' => $amount
                            ]);
        }

        return back()->withErrors(['image_url' => 'Image upload failed']);
    }

    private function extractReferenceID($text) {
        // Regular expressions for different cases of reference IDs
        $patterns = [
            '/Reference ID\s*[\r\n]?\s*(\w+)/i',          // Matches 'Reference ID'
            '/Transaction No.\s*[\r\n]?\s*(\w+)/i',       // Matches 'Transaction No.'
            '/Reference No.\s*[\r\n]?\s*(\w+)/i',         // Matches 'Reference No.'
            '/OCTO Reference No.\s*[\r\n]?\s*(\w+)/i',    // Specific for CIMB 'OCTO Reference No.'
        ];
    
        // Iterate through each pattern to find a match
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                return $matches[1]; // Return the matched reference number
            }
        }
    
        return null; // Fallback if no match is found
    }
    
    private function extractDate($text) {
        // Define multiple regex patterns to handle different date formats
        $patterns = [
            // Pattern for formats like '15 Oct 2024 05:03 pm' or '28 Sep 2024, 4:13 PM'
           '/(\d{1,2}\s*\w{3,}\s*\d{4})\s*,?\s*\d{1,2}:\d{2}\s*(AM|PM)?/i',
    
            // Pattern for formats like '15 Oct 2024'
            '/(\d{1,2}\s*\w{3,}\s*\d{4})/i',
    
            // Pattern for formats like '16/10/2024' or '16-10-2024'
            '/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/i',

            // New pattern for specific CIMB format (e.g., '15 Oct 2024 05:05:14 PM')
            '/(\d{1,2}\s*\w{3,}\s*\d{4})\s*(\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?)/i',
        ];
    
        // Iterate over the patterns and attempt to match the text
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $dateString = $matches[1]; // Get the matched date
    
                // Try different formats to convert to 'Y-m-d' format (e.g., 2024-10-06)
                $formats = ['d M Y', 'd/m/Y', 'd-m-Y'];
                foreach ($formats as $format) {
                    try {
                        $date = DateTime::createFromFormat($format, $dateString);
                        if ($date) {
                            return $date->format('Y-m-d');
                        }
                    } catch (Exception $e) {
                        // Log error if date parsing fails
                        logger()->error('Date format error: ' . $e->getMessage());
                    }
                }
            }
        }
    
        // If no pattern matches or parsing fails, return null
        return null;
    }
    
    private function extractAmount($text) {
        // Attempt to match "RM" amounts where an optional hyphen and spaces can precede "RM"
        if (preg_match('/(?<!\S)-?\s*RM[\s\x{00A0}]*([0-9,.]+)/iu', $text, $matches)) {
            return $matches[1]; // Return the amount after "RM"
        }


        // Attempt to match "MYR" amounts (specific for the RHB case)
        if (preg_match('/MYR[\s\x{00A0}]*([0-9,.]+)/iu', $text, $matches)) {
            return $matches[1]; // Return the amount after "MYR"
        }
    
        return null; // If neither pattern matches
    }
    
    public function show(Request $request): \Inertia\Response
    {
        // Retrieve the data from the session flash (set by with())
        return Inertia::render('Transactions/Show', [
            'reference_id' => $request->session()->get('reference_id'),
            'date' => $request->session()->get('date'),
            'amount' => $request->session()->get('amount'),
            'isAdmin' => BouncerFacade::is(Auth::user())->an('admin'),
        ]);
    }

    private function updateUserCounts(Transaction $transaction)
    {
        $user = $transaction->user;
        
        // Event start and end dates
        $eventStartDate = Carbon::create(2024, 11, 10); // 10th November 2024
        $eventEndDate = Carbon::create(2024, 12, 31);  // 31st December 2024
        
        // Parse transaction date
        $transactionDate = Carbon::parse($transaction->date);

        // Only update counts if the transaction is within the event date range
        if ($transactionDate->between($eventStartDate, $eventEndDate)) {
            // Calculate the number of days since the start of the event
            $daysSinceEventStart = $eventStartDate->diffInDays($transactionDate);

            // Calculate week number (1-based)
            $weekNumber = ceil(($daysSinceEventStart + 1) / 7);

            // Get the current week number based on the mock date
            $currentWeekNumber = ceil(($eventStartDate->diffInDays(Carbon::now()) + 1) / 7);
            // $currentWeekNumber = ceil(($eventStartDate->diffInDays(Carbon::create(2024, 11, 12)) + 1) / 7);

            // Check if the transaction week is before the current week
            if ($weekNumber < $currentWeekNumber) {
                throw ValidationException::withMessages([
                    'date' => ['You cannot add transactions for past weeks.'],
                ]);
            }
            else{
                // Ensure the week number is valid (1-8)
                if ($weekNumber >= 1 && $weekNumber <= 8) {
                    $weekColumn = 'week' . $weekNumber . '_count'; // e.g., week1_count, week2_count, etc.
                    $user->{$weekColumn} += 1; // Increment the specific week's count
                }

                $transactionMonth = $transactionDate->month;
                $currentMonth = Carbon::now()->month;

                if($transactionMonth < $currentMonth)
                {
                    throw ValidationException::withMessages([
                        'date' => ['You cannot add transactions for past months.'],
                    ]);
                }
                else{
                    // Update the total count for Oct, Nov, Dec
                    if ($transactionMonth >= 11 && $transactionMonth <= 12) {
                        $user->total_count += 1;
                    }
    
                    // Update the specific month's count
                    switch ($transactionMonth) {
                        case 11:
                            $user->nov_count += 1;
                            break;
                        case 12:
                            $user->dec_count += 1;
                            break;
                        default:
                            // If other months are needed, handle them here
                            break;
                    }
    
                    // Save the user model with the updated counts
                    $user->save();
                }
            }

        }
    }
}
