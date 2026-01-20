<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = ['key', 'title', 'description', 'icon'];

    public function users()
    {
        return $this->belongsToMany(
            \App\Models\User::class,
            'user_achievements', 
            'achievement_id',
            'user_id'
        )->withTimestamps();
    }
}
