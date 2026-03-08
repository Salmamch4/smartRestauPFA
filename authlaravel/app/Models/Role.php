<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';
<<<<<<< HEAD
   protected $fillable = [
        'nom',      
        'created_at',
        'updated_at'
    ];
=======
>>>>>>> feature/auth

<<<<<<< HEAD
    protected $fillable = ['nom'];

    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }

    // Optional: allow $role->name to return $role->nom
    public function getNameAttribute()
    {
        return $this->nom;
=======
    protected $fillable = ['name'];

    public function users()
    {
        return $this->hasMany(User::class);
>>>>>>> 7f1063d2793e74d51ca39ea9f24cdd6c8ac096e4
    }
}