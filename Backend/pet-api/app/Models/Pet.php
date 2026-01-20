<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'name',
        'species',
        'image',
        'description',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_pets')
            ->withPivot(['health', 'happiness', 'energy', 'last_updated'])
            ->withTimestamps();
    }
}

