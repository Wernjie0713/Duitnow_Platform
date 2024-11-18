<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;
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
            'transaction_type' => 'string',
            'image_url' => 'required|url',
        ]);

        logger()->info('Image URL in confirm:', ['url' => $request->image_url]);

        // Create and save a new transaction using the confirmed data
        $transaction = new Transaction();
        $transaction->user_id = Auth::id(); // Authenticated user
        $transaction->reference_id = $request->reference_id;
        $transaction->date = $request->date;
        $transaction->amount = $request->amount;
        $transaction->transaction_type = $request->transaction_type;
        $transaction->image_url = $request->image_url;
        
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

            $imageUrl = asset('storage/' . $imagePath);
			// Full path to the uploaded image
			$imageFullPath = storage_path('app/public/' . $imagePath);

			// OCR.space API key (replace 'your_api_key' with your actual API key)
			$apiKey = 'K87900716488957';

			// Make a request to OCR.space API
			$response = Http::attach(
				'file', file_get_contents($imageFullPath), 'image.jpg'
			)->post('https://api.ocr.space/parse/image', [
				'apikey' => $apiKey,
				'language' => 'eng',
				'isOverlayRequired' => 'false', // Set to 'false' as a string
			]);

			// Decode JSON response from OCR.space
			$ocrData = $response->json();

			if (isset($ocrData['ParsedResults'][0]['ParsedText'])) {
				// Extracted text from OCR.space
				$extractedText = $ocrData['ParsedResults'][0]['ParsedText'];

				// Use helper methods to extract specific data from the text
				$reference_id = $this->extractReferenceID($extractedText);
				$date = $this->extractDate($extractedText);
				$amount = $this->extractAmount($extractedText);
                $transaction_type = $this->extractTransactionType($extractedText);  

				// Log the full extracted text for debugging purposes
				logger()->info('Extracted Text:', ['text' => $extractedText]);
				logger()->info('Extracted Data:', [
					'reference_id' => $reference_id,
					'date' => $date,
					'amount' => $amount,
                    'transaction_type' => $transaction_type,
                    'image_url' => $imageUrl,
				]);

				return redirect()->route('transactions.show')
								->with([
									'reference_id' => $reference_id,
									'date' => $date,
									'amount' => $amount,
                                    'transaction_type' => $transaction_type,
                                    'image_url' => $imageUrl,
								]);
			} else {
				logger()->error('OCR.space API Error:', ['response' => $ocrData]);
				return back()->withErrors(['image_url' => 'OCR failed to extract text. Please try again.']);
			}
		}

		return back()->withErrors(['image_url' => 'Image upload failed']);
	}
    
    private function extractReferenceID($text) {
        // Regular expressions for different cases of reference IDs
        $patterns = [
            '/Reference ID\s*[\r\n]?\s*(\w+)/i',          // Matches 'Reference ID'
            '/Transaction No.\s*[\r\n]?\s*(\w+)/i',       // Matches 'Transaction No.'
            '/Reference No.\s*[\r\n]?\s*(\w+)/i',         // Matches 'Reference No.'
			'/Reference Number\s*[\r\n]?\s*(\w+)/i',         // Matches 'Reference Number'
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
		// Correct common OCR misinterpretations for numbers
		$text = str_replace(['I', 'O'], ['1', '0'], $text);

		// Adjust regex to allow optional space or hyphen between "RM" and the amount
		if (preg_match('/(?<!\S)-?\s*RM\s*([0-9]+(?:\.[0-9]{2})?)/iu', $text, $matches)) {
			return $matches[1]; // Return the amount after "RM"
		}

		// Adjust regex for "MYR" amounts (specific for the RHB case)
		if (preg_match('/MYR\s*([0-9]+(?:\.[0-9]{2})?)/iu', $text, $matches)) {
			return $matches[1]; // Return the amount after "MYR"
		}

		return null; // If neither pattern matches
	}

    private function extractTransactionType($text) {
        // Define known transaction type keywords, from more specific to more generic
        $transactionTypes = [
            'DuitNow QR TNGD', // more specific
            'DuitNow QR TNGo', // similar variations, prioritize if any
            'DuitNow QR',      // more generic
            'Payment',         // generic payment term
            'Transfer', 
            'QR Payment',
        ];
    
        // Try to find the "Transaction Type" label and capture data nearby
        $pattern = '/Transaction Type[\s\S]{0,40}(.*?)(\s|$)/i';
    
        if (preg_match($pattern, $text, $matches)) {
            $possibleType = trim($matches[1]);
    
            // Check if the extracted type matches any known types
            foreach ($transactionTypes as $type) {
                if (stripos($possibleType, $type) !== false) {
                    return $type;
                }
            }
        }
    
        // Fallback approach: if "Transaction Type" is not nearby, search the whole text
        foreach ($transactionTypes as $type) {
            if (stripos($text, $type) !== false) {
                return $type;
            }
        }
    
        return null; // If no valid transaction type is found
    }    
    
    public function show(Request $request): \Inertia\Response
    {
        $imageUrl = $request->session()->get('image_url');
        logger()->info('Extracted Text in show:', ['text' => $imageUrl]);
        // Retrieve the data from the session flash (set by with())
        return Inertia::render('Transactions/Show', [
            'reference_id' => $request->session()->get('reference_id'),
            'date' => $request->session()->get('date'),
            'amount' => $request->session()->get('amount'),
            'transaction_type' => $request->session()->get('transaction_type'),
            'isAdmin' => BouncerFacade::is(Auth::user())->an('admin'),
            'image_url' => $imageUrl,
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
            
            $transactionMonth = $transactionDate->month;
            $currentMonth = Carbon::now()->month;
            // Check if the transaction week is before the current week
            if($transactionMonth < $currentMonth)
                {
                    throw ValidationException::withMessages([
                        'date' => ['You cannot add transactions for past months.'],
                    ]);
                }
            else{
                // Ensure the week number is valid (1-8)
                    if ($weekNumber >= 1 && $weekNumber <= 8) {
                        $weekColumn = 'week' . $weekNumber . '_count'; // e.g., week1_count, week2_count, etc.
                        $user->{$weekColumn} += 1; // Increment the specific week's count
                    }
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
