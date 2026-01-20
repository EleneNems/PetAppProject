<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'coins'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function pets()
    {
        return $this->belongsToMany(Pet::class, 'user_pets')
            ->withPivot(['health', 'happiness', 'energy', 'last_updated'])
            ->withTimestamps();
    }

    public function stats()
    {
        return $this->hasOne(UserStat::class);
    }

    public function achievements()
    {
        return $this->belongsToMany(
            \App\Models\Achievement::class,
            'user_achievements',
            'user_id',
            'achievement_id'
        )->withTimestamps();
    }

}
