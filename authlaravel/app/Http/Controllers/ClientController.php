<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\InactiveClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    // =========================
    // CLIENT : afficher son propre profil
    // =========================
    public function myProfile(Request $request)
    {
        $user = $request->get('auth_user');

        $client = Client::where('user_id', $user->id)->first();
        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable'
            ], 404);
        }

        return response()->json($client, 200);
    }

    // =========================
    // CLIENT : update son propre profil
    // =========================
    public function updateMyProfile(Request $request)
    {
        $user = $request->get('auth_user');

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable'
            ], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email,' . $client->id,
            'telephone' => 'required|string|max:20|unique:clients,telephone,' . $client->id . '|unique:users,telephone,' . $user->id,
        ]);

        DB::transaction(function () use ($request, $client, $user) {
            $client->update([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone
            ]);

            $user->telephone = $request->telephone;
            $user->save();
        });

        return response()->json([
            'message' => 'Profil mis à jour avec succès'
        ], 200);
    }

    // =========================
    // CLIENT : désactiver son propre compte
    // =========================
   public function deactivateMyAccount(Request $request)
{
    $user = $request->get('auth_user');

    $client = Client::where('user_id', $user->id)->first();

    if (!$client) {
        return response()->json([
            'message' => 'Client introuvable'
        ], 404);
    }

    DB::transaction(function () use ($user, $client) {
        // Désactiver le client
        $client->is_active = 0;
        $client->save();

        // Désactiver l'utilisateur lié
        $user->is_active = 0;
        $user->save();
    });

    return response()->json([
        'message' => 'Votre compte a été désactivé avec succès'
    ], 200);
}

    // =========================
    // CLIENT : full update = updateMyProfile
    // =========================
    public function fullUpdate(Request $request)
    {
        return $this->updateMyProfile($request);
    }

    // =========================
    // ADMIN : afficher tous les clients
    // =========================
    public function index()
    {
        return response()->json(Client::all(), 200);
    }
}