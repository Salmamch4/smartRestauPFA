<?php

namespace App\Http\Controllers;

use App\Models\InactiveClient;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    // 🔹 GET all clients
    public function index()
    {
        return Client::all();
    }

    // 🔹 UPDATE client
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        DB::transaction(function () use ($request, $client) {

            // Update client table
            $client->update([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone
            ]);

            // Update user table
            $user = User::find($client->user_id);
            if ($user) {
                $user->telephone = $request->telephone;
                $user->save();
            }
        });

        return response()->json(['message' => 'Updated successfully']);
    }

    // 🔹 DELETE client
  public function destroy($user_id)
{
    // 1. Trouver le client par son user_id (clé primaire définie dans ton modèle)
    $client = Client::where('user_id', $user_id)->firstOrFail();

    // 2. Créer l'archive dans la table que tu as créée
    InactiveClient::create([
        'nom'            => $client->nom,
        'telephone'      => $client->telephone,
        'email'          => $client->email,
        'reason'         => 'Suppression définitive du compte',
        'inactivated_at' => now(),
    ]);

    // 3. Supprimer le client (cela supprimera aussi l'User grâce au onDelete cascade)
    $client->delete();

    return response()->json(['message' => 'Client archivé et supprimé avec succès !']);
}
}