<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pet;
use App\Models\User;
use App\Models\Achievement;
use Carbon\Carbon;
use App\Models\ActivityLog;

class PetController extends Controller
{
    public function index()
    {
        return Pet::all()->map(fn($pet) => [
            'id' => $pet->id,
            'name' => $pet->name,
            'species' => $pet->species,
            'description' => $pet->description,
            'image' => asset('storage/' . $pet->image)
        ]);
    }


    public function adopt(Request $request, $petId)
    {
        $user = $request->user();

        if ($user->pets()->where('pet_id', $petId)->exists()) {
            return response()->json(['message' => 'Already adopted'], 409);
        }

        $user->pets()->attach($petId, [
            'health' => 100,
            'happiness' => 100,
            'energy' => 100,
            'last_updated' => now()
        ]);

        $this->checkAchievements($user);

        return response()->json(['message' => 'Pet adopted']);
    }

    public function myPet(Request $request)
    {
        $user = $request->user();

        $pets = $user->pets->map(function ($pet) {
            $pivot = $pet->pivot;
            $this->applyDecay($pivot);

            return [
                'id' => $pet->id,
                'name' => $pet->name,
                'species' => $pet->species,
                'image' => asset('storage/' . $pet->image),
                'stats' => [
                    'health' => $pivot->health,
                    'happiness' => $pivot->happiness,
                    'energy' => $pivot->energy,
                ]
            ];
        });

        return response()->json([
            'pets' => $pets,
            'coins' => $user->coins
        ]);
    }

    private function applyDecay($pivot)
    {
        if (!$pivot->last_updated)
            return;

        $minutes = Carbon::parse($pivot->last_updated)->diffInMinutes(now());
        if ($minutes < 10)
            return;

        $steps = floor($minutes / 10);

        $pivot->health = max(0, $pivot->health - ($steps * 2));
        $pivot->happiness = max(0, $pivot->happiness - ($steps * 3));
        $pivot->energy = max(0, $pivot->energy - ($steps * 4));
        $pivot->last_updated = now();

        if ($pivot->health === 0 || $pivot->happiness === 0 || $pivot->energy === 0) {
            $pivot->delete();
            return;
        }

        $pivot->save();
    }

    private function modifyStat($petId, $stat, $amount, $coinCost)
    {
        $user = auth()->user();
        $pet = $user->pets()->where('pet_id', $petId)->firstOrFail();
        $pivot = $pet->pivot;

        if ($user->coins < $coinCost) {
            return response()->json(['message' => 'Not enough coins'], 403);
        }

        if ($pivot->$stat >= 100) {
            return response()->json(['message' => 'Stat already full'], 409);
        }

        $user->decrement('coins', $coinCost);

        $pivot->$stat = min(100, $pivot->$stat + $amount);
        $pivot->last_updated = now();

        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);
        $stats->xp += 10;

        if ($stats->xp >= $stats->level * 100) {
            $stats->xp -= $stats->level * 100;
            $stats->level++;
        }

        $pivot->save();
        $stats->save();

        $this->checkAchievements($user);

        return response()->json([
            'coins' => $user->coins,
            'level' => $stats->level,
            'xp' => $stats->xp
        ]);
    }

    public function feed($petId)
    {
        return $this->modifyStat($petId, 'health', 15, 5);
    }

    public function play($petId)
    {
        return $this->modifyStat($petId, 'happiness', 15, 5);
    }

    public function rest($petId)
    {
        return $this->modifyStat($petId, 'energy', 20, 5);
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);
        $pets = $user->pets;

        $allAchievements = Achievement::all();
        $user->load('achievements');

        $achievements = $allAchievements->map(fn($a) => [
            'id' => $a->id,
            'title' => $a->title,
            'icon' => $a->icon,
            'desc' => $a->description,
            'unlocked' => $user->achievements->contains($a->id)
        ]);

        $health = $pets->isEmpty() ? 0 : round($pets->avg('pivot.health'));
        $happiness = $pets->isEmpty() ? 0 : round($pets->avg('pivot.happiness'));
        $energy = $pets->isEmpty() ? 0 : round($pets->avg('pivot.energy'));

        return response()->json([
            'health' => $health,
            'happiness' => $happiness,
            'energy' => $energy,
            'level' => $stats->level,
            'xp' => $stats->xp,
            'nextLevelXp' => ($stats->level * 100) - $stats->xp,
            'achievements' => $achievements
        ]);
    }

    private function checkAchievements(User $user)
    {
        $user->load(['pets', 'achievements', 'stats']);

        $unlock = function ($key) use ($user) {
            $achievement = Achievement::where('key', $key)->first();
            if ($achievement && !$user->achievements->contains($achievement->id)) {
                $user->achievements()->attach($achievement->id);
            }
        };

        if ($user->pets->count() >= 1)
            $unlock('first_pet');
        if ($user->stats->level >= 5)
            $unlock('level_5');
        if ($user->coins >= 1000)
            $unlock('rich');
    }

    public function completeActivity(Request $request)
    {
        $request->validate([
            'activity' => 'required|string'
        ]);

        $user = $request->user();

        $activities = [
            'clean' => [
                'coins' => 10,
                'xp' => 5
            ],
            'groom' => [
                'coins' => 8,
                'xp' => 5
            ],
            'train' => [
                'coins' => 15,
                'xp' => 8
            ],
        ];

        if (!isset($activities[$request->activity])) {
            return response()->json(['message' => 'Invalid activity'], 400);
        }

        $reward = $activities[$request->activity];

        ActivityLog::create([
            'user_id' => $user->id,
            'activity' => $request->activity,
        ]);

        $user->increment('coins', $reward['coins']);

        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);
        $stats->xp += $reward['xp'];

        while ($stats->xp >= $stats->level * 100) {
            $stats->xp -= $stats->level * 100;
            $stats->level++;
        }

        $stats->save();

        $this->checkAchievements($user);

        return response()->json([
            'coins' => $user->coins,
            'level' => $stats->level,
            'xp' => $stats->xp
        ]);
    }

    public function storePet(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'species' => 'required|string',
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('pets', 'public');

        $pet = Pet::create([
            'name' => $request->name,
            'species' => $request->species,
            'image' => $path
        ]);

        return response()->json([
            'message' => 'Pet uploaded successfully!',
            'pet' => $pet
        ]);
    }

    public function show($id)
    {
        $pet = Pet::findOrFail($id);

        return response()->json([
            'id' => $pet->id,
            'name' => $pet->name,
            'species' => $pet->species,
            'image' => asset('storage/' . $pet->image),
            'description' => $pet->description
        ]);
    }

}
