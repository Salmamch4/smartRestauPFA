<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AccountRequest;
use App\Models\Employee;
use App\Models\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    // --- STATISTIQUES ---
    public function getStats() {
    try {
        return response()->json([
            'total_clients' => \App\Models\Client::count(),
            'total_employees' => \App\Models\Employee::count(),
            'inactive_archives' => 0 // Valeur par défaut pour éviter l'erreur
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
 // --- GESTION DES CLIENTS ---
    public function getClients()
    {
        return response()->json(
            Client::with('user')->get()
        );
    }

    public function toggleClientStatus($id)
    {
        $client = Client::findOrFail($id);

        $user = User::find($client->user_id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur lié au client introuvable'
            ], 404);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => $user->is_active
                ? 'Compte client réactivé avec succès'
                : 'Compte client désactivé avec succès',
            'is_active' => $user->is_active
        ]);
    }
    // --- GESTION DES EMPLOYÉS ---
    public function getEmployees() {
        return response()->json(Employee::all());
    }

    public function storeEmployee(Request $request) {
        return DB::transaction(function () use ($request) {
            $role_id = $request->role_id;

            $user = User::create([
                'name' => $request->nom . ' ' . $request->prenom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'password' => bcrypt('password123'),
                'role_id' => $role_id,
                'is_active' => true
            ]);

            DB::table('employees')->insert([
                'user_id' => $user->id,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'email' => $request->email,
                'role_id' => $role_id,
                'salaire' => $request->salaire,
                'date_embauche' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['message' => 'Employé créé'], 201);
        });
    }

   public function updateEmployee(Request $request, $id) {
    $employee = \App\Models\Employee::findOrFail($id);
    $employee->update($request->all()); // Met à jour avec les nouvelles infos
    return response()->json(['message' => 'Employé mis à jour']);
}

   public function deleteEmployee($id) {
    try {
        // Laravel utilisera automatiquement 'user_id' pour la requête
        $deleted = \App\Models\Employee::destroy($id); 

        if ($deleted) {
            return response()->json(['message' => 'Employé supprimé avec succès']);
        }
        return response()->json(['error' => 'Employé introuvable'], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    

    
}