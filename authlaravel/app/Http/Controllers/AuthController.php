<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;


class AuthController extends Controller
{
      public function login(Request $request){
        $request->validate([
            'telephone'=>'required|string',
            'password'=>'required|string'
        ]);
        $user=User::where('telephone',$request->telephone)->first();

        if(!$user || !Hash::check($request->password , $user->password)){
            return response()->json([
                'error'=>'les identifiants sont incorrectes.'
            ],401);
        }
         try {
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'user' => [
                    'id' => $user->id,
                    'telephone' => $user->telephone,
                    'role' => $user->role ? $user->role->nom : 'CLIENT'
                ]
            ]);
            } catch (JWTException $e) {
            return response()->json([
                'error' => 'Impossible de créer le token'
            ], 500);
        }

      }



      public function me()
    {
          try {
            $user = auth()->user();
            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Non authentifié'
            ], 401);
        }
    }


    public function logout()
    {
        auth()->logout();
        return response()->json([
            'statut' => true,
            "message" =>  "user logout !"
        ]);
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
