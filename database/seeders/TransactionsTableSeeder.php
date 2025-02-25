<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Transaction;

class TransactionsTableSeeder extends Seeder
{
    /**
     * Run the transaction seeds.
     *
     * This seeder will:
     *  1. Fetch all users.
     *  2. For each user, generate exactly nov_count transactions in November
     *     and dec_count transactions in December.
     *  3. For each transaction, assign a date randomly within the month’s window:
     *     - November window: 2024-11-10 to 2024-11-30
     *     - December window: 2024-12-01 to 2024-12-31
     *  4. Generate a reference_id that mimics a real transaction reference
     *     and an image_url based on that reference.
     *  5. Insert records in batches.
     *
     * New Totals:
     *   - Total November Count: 645869
     *   - Total December Count: 860815
     *   - Total Cumulative Count: 1506684
     */
    public function run()
    {
        // Disable query log to prevent memory bloat
        DB::connection()->disableQueryLog();

        // You can filter users if needed, for example only "complete" users.
        $query = User::query();

        // Batch size for inserts
        $batchSize = 1000;
        $transactionBatch = [];

        // Define date windows
        $novStart = Carbon::create(2024, 11, 10);
        $novEnd   = Carbon::create(2024, 11, 30);

        $decStart = Carbon::create(2024, 12, 1);
        $decEnd   = Carbon::create(2024, 12, 31);

        // Process users in chunks
        $query->chunk(500, function ($users) use (&$transactionBatch, $batchSize, $novStart, $novEnd, $decStart, $decEnd) {
            foreach ($users as $user) {
                // Generate transactions for November based on nov_count
                $novCount = (int)$user->nov_count;
                for ($i = 1; $i <= $novCount; $i++) {
                    $transactionBatch[] = $this->makeTransactionRow(
                        $user->id,
                        $this->randomDateInRange($novStart, $novEnd)
                    );

                    if (count($transactionBatch) >= $batchSize) {
                        Transaction::insert($transactionBatch);
                        $transactionBatch = [];
                    }
                }

                // Generate transactions for December based on dec_count
                $decCount = (int)$user->dec_count;
                for ($j = 1; $j <= $decCount; $j++) {
                    $transactionBatch[] = $this->makeTransactionRow(
                        $user->id,
                        $this->randomDateInRange($decStart, $decEnd)
                    );

                    if (count($transactionBatch) >= $batchSize) {
                        Transaction::insert($transactionBatch);
                        $transactionBatch = [];
                    }
                }
            }
        });

        // Insert any remaining rows
        if (!empty($transactionBatch)) {
            Transaction::insert($transactionBatch);
        }
    }

    /**
     * Build a single transaction row with a reference_id and image_url that mimic real data.
     *
     * Pattern for reference_id:
     *   <YYYYMMDD><bankCode><MYKL><4-digit>QR<8-digit>
     * Example: 20241129RHBMYKL0400QR57078389
     *
     * The image_url will be:
     *   storage/transactions/<reference_id>.jpg
     */
    private function makeTransactionRow(int $userId, Carbon $date): array
    {
        // Format date as YYYYMMDD
        $datePart = $date->format('Ymd');
        // Define possible bank codes (you can expand this array as needed)
        $bankCodes = ['RHB', 'MAYBANK', 'CIMB', 'PUBLIC'];
        $bankCode = $bankCodes[array_rand($bankCodes)];
        // Fixed branch/indicator code; adjust if needed
        $branchCode = 'MYKL';
        // Generate a 4-digit random number (zero-padded)
        $fourDigit = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
        // Generate an 8-digit random number (zero-padded)
        $eightDigit = str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);
        // Construct reference_id using the above pieces
        $referenceId = $datePart . $bankCode . $branchCode . $fourDigit . 'QR' . $eightDigit;

        // For image_url, we mimic a public storage URL using the reference_id
        $imageUrl = "storage/transactions/{$referenceId}.jpg";

        return [
            'user_id'          => $userId,
            'reference_id'     => $referenceId,
            'date'             => $date->format('Y-m-d'),
            'amount'           => round(mt_rand(100, 5000) / 100, 2), // generates an amount between 1.00 and 50.00
            'image_url'        => $imageUrl,
            'transaction_type' => null,
            'created_at'       => now(),
            'updated_at'       => now(),
        ];
    }

    /**
     * Generate a random date between $start and $end (inclusive).
     */
    private function randomDateInRange(Carbon $start, Carbon $end): Carbon
    {
        $min = $start->getTimestamp();
        $max = $end->getTimestamp();
        $randTs = mt_rand($min, $max);
        return Carbon::createFromTimestamp($randTs);
    }
}
