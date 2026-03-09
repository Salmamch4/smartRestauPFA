<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InactiveClient extends Model
{
    protected $fillable = [
        'nom', 
        'telephone', 
        'email', 
        'reason', 
        'inactivated_at'
    ];
}