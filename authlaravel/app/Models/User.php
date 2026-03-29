<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

   protected $fillable = [
    'telephone',
    'email',
    'password',
    'role_id',
    'is_active'
];

// Relation pour récupérer le nom du rôle si besoin
public function role() {
    return $this->belongsTo(Role::class);
}

protected $hidden = ['password'];

public function getJWTIdentifier()
{
    return $this->getKey();
}

public function getJWTCustomClaims()
{
    return [
        'iss' => env('JWT_ISSUER'),
        'aud' => env('JWT_AUDIENCE'),
    ];
}

   

    public function client()
    {
        return $this->hasOne(Client::class);
    }
}