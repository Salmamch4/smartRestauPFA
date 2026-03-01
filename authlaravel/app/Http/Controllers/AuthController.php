<?php

namespace App\Http\Controllers;

use App\Services\ClientAuthService;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function __construct(private ClientAuthService $service) {}

    public function registerClient(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',

            // باش نضمنو unique فـ users و clients بجوج
            'telephone' => 'required|string|max:20|unique:users,telephone|unique:clients,telephone',
            'email' => 'required|email|unique:users,email|unique:clients,email',

            'password' => 'required|min:6|confirmed',
        ]);

        $res = $this->service->register($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Client inscrit avec succès',
            'access_token' => $res['token'],
            'token_type' => 'bearer',
            'user' => [
                'id' => $res['user']->id,
                'name' => $res['user']->name,
                'telephone' => $res['user']->telephone,
                'email' => $res['user']->email,
                'role' => $res['user']->role?->nom ?? 'CLIENT',
                'is_active' => $res['user']->is_active,
            ],
            'client' => [
                'id' => $res['client']->id,
                'nom' => $res['client']->nom,
                'telephone' => $res['client']->telephone,
                'email' => $res['client']->email,
                'points_fidelite' => $res['client']->points_fidelite,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'password'  => 'required|string',
        ]);

        try {
            $res = $this->service->login($request->telephone, $request->password);

            return response()->json([
                'success' => true,
                'access_token' => $res['token'],
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'user' => [
                    'id' => $res['user']->id,
                    'name' => $res['user']->name,
                    'telephone' => $res['user']->telephone,
                    'email' => $res['user']->email,
                    'role' => $res['user']->role?->nom ?? 'CLIENT',
                    'is_active' => $res['user']->is_active,
                ],
                'client' => $res['client'] ? [
                    'id' => $res['client']->id,
                    'nom' => $res['client']->nom,
                    'telephone' => $res['client']->telephone,
                    'email' => $res['client']->email,
                    'points_fidelite' => $res['client']->points_fidelite,
                ] : null,
            ]);

        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Impossible de créer le token'], 500);
        }
    }


    public function logout(Request $request)
    {
        return response()->json([
            'statut' => true,
            'message' => 'user logout !'
        ])->cookie('token', '', -1);
    }

    public  function refresh()
    {
        $newToken = auth()->refresh();
        return response()->json([
            'statut' => true,
            "token" =>  $newToken
        ]);
    }
}
