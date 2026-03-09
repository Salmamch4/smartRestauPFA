<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AccountRequest;
use App\Models\Employee;
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
  // App/Http/Controllers/AdminController.php

public function getClients() {
    return response()->json(\App\Models\Client::all()); // Récupère tout le monde
}

public function toggleClientStatus($id) {
    $client = \App\Models\Client::findOrFail($id);
    $client->is_active = !$client->is_active; // Alterne entre activé et désactivé
    $client->save();
    
    // Optionnel : Envoyer email de désactivation ici
    return response()->json(['message' => 'Statut mis à jour']);
}

public function deleteClient($id) {
    try {
        $client = \App\Models\Client::find($id);
        if (!$client) {
            return response()->json(['error' => 'Client introuvable'], 404);
        }

        $emailCible = $client->email;
        $client->delete();

        // Tentative d'envoi d'email (ne pas bloquer si erreur SMTP)
        try {
            \Mail::raw("Votre compte a été supprimé.", function ($message) use ($emailCible) {
                $message->to($emailCible)->subject("Notification");
            });
        } catch (\Exception $e) {}

        return response()->json(['message' => 'Client supprimé']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
    // --- GESTION DES EMPLOYÉS ---
    public function getEmployees() {
        return response()->json(Employee::all());
    }

    public function storeEmployee(Request $request) {
        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->nom . ' ' . $request->prenom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'password' => bcrypt('password123'),
                'role_id' => 2,
                'is_active' => true
            ]);

            DB::table('employees')->insert([
                'user_id' => $user->id,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'email' => $request->email,
                'poste' => $request->poste,
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