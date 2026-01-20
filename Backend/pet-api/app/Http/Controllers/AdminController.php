<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Pet;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'users' => User::count(),
            'pets' => Pet::count(),

            'activities' => ActivityLog::count(),

            'avgLevel' => round(
                User::join('user_stats', 'users.id', '=', 'user_stats.user_id')
                    ->avg('user_stats.level')
            ) ?? 0,
        ]);
    }
    public function indexPets()
    {
        return Pet::all()->map(fn($pet) => [
            'id' => $pet->id,
            'name' => $pet->name,
            'species' => $pet->species,
            'description' => $pet->description,
            'image_url' => asset('storage/' . $pet->image),
        ]);
    }


    public function storePet(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'description' => 'nullable|string', // <-- new field
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('pets', 'public');

        $pet = Pet::create([
            'name' => $validated['name'],
            'species' => $validated['species'],
            'description' => $validated['description'] ?? '',
            'image' => $path,
        ]);

        return response()->json([
            'id' => $pet->id,
            'name' => $pet->name,
            'species' => $pet->species,
            'description' => $pet->description,
            'image_url' => asset('storage/' . $path),
        ], 201);
    }

    public function updatePet(Request $request, Pet $pet)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'description' => 'nullable|string', // <-- new field
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($pet->image) {
                Storage::disk('public')->delete($pet->image);
            }
            $pet->image = $request->file('image')->store('pets', 'public');
        }

        $pet->update([
            'name' => $request->name,
            'species' => $request->species,
            'description' => $request->description ?? $pet->description,
        ]);

        return response()->json([
            'message' => 'Pet updated successfully',
            'pet' => $pet
        ]);
    }


    public function deletePet(Pet $pet)
    {
        if ($pet->image) {
            Storage::disk('public')->delete($pet->image);
        }

        $pet->delete();

        return response()->json(['message' => 'Pet deleted']);
    }

    public function getUsers()
    {
        return User::all()->map(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'coins' => $user->coins
        ]);
    }

    public function switchRole(User $user)
    {
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'You cannot change your own role'], 403);
        }

        $user->role = $user->role === 'admin' ? 'user' : 'admin';
        $user->save();

        return response()->json([
            'message' => 'Role updated',
            'user' => [
                'id' => $user->id,
                'role' => $user->role
            ]
        ]);
    }

    public function engagementReport()
    {
        $totalUsers = User::count();

        $activeUsers = ActivityLog::distinct('user_id')->count('user_id');

        $totalActivities = ActivityLog::count();

        $activitiesByType = ActivityLog::select('activity', DB::raw('count(*) as count'))
            ->groupBy('activity')
            ->pluck('count', 'activity');

        $topUsers = ActivityLog::select(
            'users.id',
            'users.name',
            DB::raw('count(activity_logs.id) as activity_count')
        )
            ->join('users', 'users.id', '=', 'activity_logs.user_id')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('activity_count')
            ->limit(5)
            ->get();

        return response()->json([
            'summary' => [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalActivities' => $totalActivities,
            ],
            'activitiesByType' => $activitiesByType,
            'topUsers' => $topUsers,
        ]);
    }
}
