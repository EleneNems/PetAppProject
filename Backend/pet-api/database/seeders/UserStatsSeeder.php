<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserStat;

class UserStatsSeeder extends Seeder
{
    public function run(): void
    {
        User::all()->each(function ($user) {
            UserStat::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'level' => 1,
                    'xp' => 0
                ]
            );
        });
    }
}
