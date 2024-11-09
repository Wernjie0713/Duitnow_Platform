<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Silber\Bouncer\BouncerFacade;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'is_profile_complete' => true,
        ]);

        $admin->assign(['admin']);

        // Define abilities
        BouncerFacade::ability()->firstOrCreate([
            'name' => 'manage-transactions',
            'title' => 'Manage Transaction',
        ]);
        BouncerFacade::ability()->firstOrCreate([
            'name' => 'edit-profile',
            'title' => 'Edit Profile',
        ]);

        // Assign ability to user role only
        BouncerFacade::allow('user')->to('manage-transactions');
        BouncerFacade::disallow('admin')->to('manage-transactions');

        BouncerFacade::allow('user')->to('edit-profile');
        BouncerFacade::disallow('admin')->to('edit-profile');
    }
}
