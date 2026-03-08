<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory,Notifiable;
    protected $table = "users";
    protected $fillable = [
        'name',
        'telephone',
        'email',
        'password',
        'role_id',
        'is_active',
    ];

<<<<<<< HEAD
    protected $hidden = [
        'password',
        'remember_token',
    ];

protected $casts = [
    'password'=> 'hashed',
    'is_active'=> 'boolean',
    'created_at'=>'datetime',
    'updated_at'=> 'datetime'
];

// Get the identifier that will be stored in the subject claim of the JWT.
=======
    protected $hidden = ['password'];

>>>>>>> feature/auth
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user_id' => $this->id,
            'telephone' => $this->telephone,
            'email' => $this->email,
            'role_id' => $this->role_id,
            'is_active' => $this->is_active
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

<<<<<<< HEAD
    /**
     * Scopes
     */
    public function scopeFindByTelephone($query, $telephone)
    {
        return $query->where('telephone', $telephone);
    }

    public function scopeFindByEmail($query, $email)
    {
        return $query->where('email', $email);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

}
=======
    public function client()
    {
        return $this->hasOne(Client::class);
    }
}
>>>>>>> feature/auth
