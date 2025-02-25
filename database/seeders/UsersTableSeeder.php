<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // If your target is 8969 users and you currently seed 8859,
        // update $numUsers accordingly.
        $numUsers = 8811;
        $desiredTotalAllUsers = 1500000; // 1.5 million total transactions
        
        // Pre-hashed password for all users
        $hashedPassword = '$2y$10$3k123'; // Example hash; replace as needed
        
        $faker = Faker::create('ms_MY');
        
        // For storing used matric numbers to guarantee uniqueness
        $usedMatricNos = [];
        $usedDuitNowIds = [];
        $usedPhoneNos = [];

        // Possible matric pieces and mapping for faculty
        $matricPrefixes = ['A', 'B'];
        $matricYears = [21, 22, 23, 24];
        $codesToFaculty = [
            'EC' => 'Faculty of Computing (FC)',
            'CS' => 'Faculty of Computing (FC)',
            'BE' => 'Faculty of Build Environment (FABU)',
            'KE' => 'Faculty of Electrical Engineering (FKE)',
            'KA' => 'Faculty of Civil Engineering (FKA)',
            'KM' => 'Faculty of Mechanical Engineering (FKM)',
            'SC' => 'Faculty of Science (FS)',
            'MT' => 'Faculty of Science (FS)',
            'HP' => 'Faculty of Management (FM)',
            'FM' => 'Faculty of Management (FM)',
            'HM' => 'Faculty of Management (FM)',
        ];

        $campusOptions = [
            'UTM JOHOR BAHRU',
            'UTM KUALA LUMPUR',
            'UTM PAGOH',
        ];

        $usersData = [];

        for ($i = 0; $i < $numUsers; $i++) {
            // Use Faker's built-in name generator for more natural names.
            $fullName = $faker->name;

            // 10% chance of UTMSPACE user
            $isUtmsSpace = (rand(1, 10) === 10);
            $matricNo = $this->generateUniqueMatricNo(
                $faker,
                $usedMatricNos,
                $isUtmsSpace,
                $matricPrefixes,
                $matricYears,
                array_keys($codesToFaculty)
            );

            if ($isUtmsSpace) {
                $faculty = 'UTMSPACE (School of Professional and Continuing Education)';
            } else {
                $code = substr($matricNo, 3, 2);
                $faculty = $codesToFaculty[$code] ?? 'Faculty of Management (FM)';
            }

            // Generate a short email portion (ensuring uniqueness)
            $shortName = strtolower(preg_replace('/\s+/', '', $fullName));
            $shortName = substr($shortName, 0, 6) . $i;
            $email = $shortName . '@graduate.utm.my';

            $campusVal = $this->pickCampusWeighted($campusOptions);
            $phoneNo = $this->generateUniqueMalaysianPhone($usedPhoneNos);
            $duitNowId = $this->generateUniqueDuitNowId($usedDuitNowIds);

            $usersData[] = [
                'name'                => $fullName,
                'email'               => $email,
                'matric_no'           => $matricNo,
                'password'            => $hashedPassword,
                'duitnow_id'          => $duitNowId,
                'faculty'             => $faculty,
                'campus'              => $campusVal,
                'phone_no'            => $phoneNo,
                'week1_count'         => 0,
                'week2_count'         => 0,
                'week3_count'         => 0,
                'week4_count'         => 0,
                'week5_count'         => 0,
                'week6_count'         => 0,
                'week7_count'         => 0,
                'week8_count'         => 0,
                'nov_count'           => 0,
                'dec_count'           => 0,
                'total_count'         => 0,
                'is_profile_complete' => true,
                'remember_token'      => Str::random(10),
                'created_at'          => now(),
                'updated_at'          => now(),
            ];
        }

        // PHASE 2: Assign random weekly counts and scale to a total of ~1,500,000
        $sumAllUsers = 0;
        foreach ($usersData as $idx => $u) {
            $w1 = rand(0, 300);
            $w2 = rand(0, 300);
            $w3 = rand(0, 300);
            $w4 = rand(0, 300);
            $w5 = rand(0, 300);
            $w6 = rand(0, 300);
            $w7 = rand(0, 300);
            $w8 = 0;

            $nov = $w1 + $w2 + $w3;
            $dec = $w4 + $w5 + $w6 + $w7;
            $total = $nov + $dec;

            $usersData[$idx]['week1_count'] = $w1;
            $usersData[$idx]['week2_count'] = $w2;
            $usersData[$idx]['week3_count'] = $w3;
            $usersData[$idx]['week4_count'] = $w4;
            $usersData[$idx]['week5_count'] = $w5;
            $usersData[$idx]['week6_count'] = $w6;
            $usersData[$idx]['week7_count'] = $w7;
            $usersData[$idx]['week8_count'] = $w8;

            $usersData[$idx]['nov_count']   = $nov;
            $usersData[$idx]['dec_count']   = $dec;
            $usersData[$idx]['total_count'] = $total;

            $sumAllUsers += $total;
        }

        $scaleFactor = $desiredTotalAllUsers / max($sumAllUsers, 1);

        $scaledSumAllUsers = 0;
        foreach ($usersData as $idx => $u) {
            $w1 = (int) round($u['week1_count'] * $scaleFactor);
            $w2 = (int) round($u['week2_count'] * $scaleFactor);
            $w3 = (int) round($u['week3_count'] * $scaleFactor);
            $w4 = (int) round($u['week4_count'] * $scaleFactor);
            $w5 = (int) round($u['week5_count'] * $scaleFactor);
            $w6 = (int) round($u['week6_count'] * $scaleFactor);
            $w7 = (int) round($u['week7_count'] * $scaleFactor);
            $w8 = 0;

            $nov = $w1 + $w2 + $w3;
            $dec = $w4 + $w5 + $w6 + $w7;
            $total = $nov + $dec;

            $usersData[$idx]['week1_count'] = $w1;
            $usersData[$idx]['week2_count'] = $w2;
            $usersData[$idx]['week3_count'] = $w3;
            $usersData[$idx]['week4_count'] = $w4;
            $usersData[$idx]['week5_count'] = $w5;
            $usersData[$idx]['week6_count'] = $w6;
            $usersData[$idx]['week7_count'] = $w7;
            $usersData[$idx]['week8_count'] = $w8;
            $usersData[$idx]['nov_count']   = $nov;
            $usersData[$idx]['dec_count']   = $dec;
            $usersData[$idx]['total_count'] = $total;

            $scaledSumAllUsers += $total;
        }

        $chunks = array_chunk($usersData, 1000);
        foreach ($chunks as $chunk) {
            User::insert($chunk);
        }
    }

    private function generateUniqueMatricNo($faker, array &$usedMatricNos, bool $isUtmsSpace, array $matricPrefixes, array $matricYears, array $validCodes)
    {
        $matricNo = '';

        do {
            if ($isUtmsSpace) {
                $year = $faker->randomElement($matricYears);
                $random4 = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
                $matricNo = 'F' . $year . 'SP' . $random4;
            } else {
                $prefix = $faker->randomElement($matricPrefixes);
                $year = $faker->randomElement($matricYears);
                $code = $faker->randomElement($validCodes);
                $random4 = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
                $matricNo = $prefix . $year . $code . $random4;
            }
        } while (isset($usedMatricNos[$matricNo]));

        $usedMatricNos[$matricNo] = true;

        return $matricNo;
    }

    // Instead of using custom arrays, we now use Faker's built-in name generator
    private function getMalaysianName($faker)
    {
        return $faker->name;
    }

    private function pickCampusWeighted(array $campusOptions)
    {
        $r = rand(1, 10);
        if ($r <= 7) {
            return 'UTM JOHOR BAHRU';
        } elseif ($r <= 9) {
            return 'UTM KUALA LUMPUR';
        }
        return 'UTM PAGOH';
    }

    private function generateUniqueMalaysianPhone(array &$usedPhoneNos): string
    {
        $starts = ['011','012','013','014','015','016','017','018','019'];
        
        do {
            $prefix = $starts[array_rand($starts)];
            $middle = rand(100, 999);
            $end    = rand(1000, 9999);
            $phoneNo = $prefix . '-' . $middle . $end;
        } while (isset($usedPhoneNos[$phoneNo]));

        $usedPhoneNos[$phoneNo] = true;

        return $phoneNo;
    }

    private function generateUniqueDuitNowId(array &$usedDuitNowIds): string
    {
        $starts = ['011','012','013','014','015','016','017','018','019'];
        do {
            $prefix = $starts[array_rand($starts)];
            $middle = rand(100, 999);
            $end    = rand(1000, 9999);
            $duitNowId = $prefix . $middle . $end;
        } while (isset($usedDuitNowIds[$duitNowId]));

        $usedDuitNowIds[$duitNowId] = true;

        return $duitNowId;
    }
}
