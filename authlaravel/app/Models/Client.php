<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'user_id',
        'nom',
        'telephone',
        'email',
        'password',
        'points_fidelite',
    ];

    protected $hidden = ['password'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}