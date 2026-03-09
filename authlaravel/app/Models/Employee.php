<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $primaryKey = 'user_id';
    // On autorise Laravel à écrire dans ces colonnes
    protected $fillable = [
        'nom', 'prenom', 'telephone', 'adresse', 
        'email', 'poste', 'salaire', 'date_embauche'
    ];

    // Relation avec la table Users
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}