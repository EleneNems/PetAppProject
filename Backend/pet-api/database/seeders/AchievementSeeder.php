<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'key' => 'first_pet',
                'title' => 'First Steps',
                'description' => 'Adopted your first pet',
                'icon' => '🌟'
            ],
            [
                'key' => 'level_5',
                'title' => 'Getting Serious',
                'description' => 'Reach level 5',
                'icon' => '🎯'
            ],
            [
                'key' => 'rich',
                'title' => 'Big Spender',
                'description' => 'Have 1000+ coins',
                'icon' => '🪙'
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::firstOrCreate(
                ['key' => $achievement['key']],
                $achievement
            );
        }
    }
}
