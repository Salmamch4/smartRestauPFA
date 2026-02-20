<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';
   protected $fillable = [
        'nom',        // C'est 'nom' pas 'name' dans ta table!
        'created_at',
        'updated_at'
    ];

    /**
     * Get the users for the role.
     */
     public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
    
    public function getNameAttribute()
    {
        return $this->nom;
    }
}