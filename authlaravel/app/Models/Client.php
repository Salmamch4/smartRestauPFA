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
        'points_fidelite'
    ];

    // Client belongs to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    protected $primaryKey = 'user_id'; 
public $incrementing = true;
protected $keyType = 'int';
}