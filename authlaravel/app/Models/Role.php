<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $fillable = ['nom'];

    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }

    // Optional: allow $role->name to return $role->nom
    public function getNameAttribute()
    {
        return $this->nom;
    }
}