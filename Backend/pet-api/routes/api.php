<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetController;
use App\Models\User;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/pets/{id}', [PetController::class, 'show']);
Route::get('/pets', [PetController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-pet', [PetController::class, 'myPet']);
    Route::post('/pets/{id}/adopt', [PetController::class, 'adopt']);
    Route::get('/pet-stats', [PetController::class, 'stats']);
    Route::post('/pets/{id}/feed', [PetController::class, 'feed']);
    Route::post('/pets/{id}/play', [PetController::class, 'play']);
    Route::post('/pets/{id}/rest', [PetController::class, 'rest']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/leaderboard', function () {
        return User::with('stats')
            ->orderByDesc('stats.level')
            ->orderByDesc('stats.xp')
            ->take(10)
            ->get()
            ->map(fn($u) => [
                'name' => $u->name,
                'level' => $u->stats->level,
                'xp' => $u->stats->xp
            ]);
    });
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/pets', [AdminController::class, 'indexPets']);
    Route::post('/pets', [AdminController::class, 'storePet']);
    Route::post('/pets/{pet}', [AdminController::class, 'updatePet']);
    Route::put('/pets/{pet}', [AdminController::class, 'updatePet']);
    Route::delete('/pets/{pet}', [AdminController::class, 'deletePet']);

    Route::get('/engagement-report', [AdminController::class, 'engagementReport']);



    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users/{user}/switch-role', [AdminController::class, 'switchRole']);

});

Route::post('/activities/complete', [PetController::class, 'completeActivity'])
    ->middleware('auth:sanctum');
