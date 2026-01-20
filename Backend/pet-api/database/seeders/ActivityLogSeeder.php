<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\User;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $activities = ['feed_pet', 'play_with_pet', 'rest_pet', 'adopt_pet'];

        foreach (User::all() as $user) {
            for ($i = 0; $i < rand(5, 30); $i++) {
                ActivityLog::create([
                    'user_id' => $user->id,
                    'activity' => $activities[array_rand($activities)],
                    'created_at' => now()->subDays(rand(0, 14)),
                ]);
            }
        }
    }
}
