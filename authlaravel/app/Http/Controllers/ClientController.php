<?php

namespace App\Http\Controllers;

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
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}