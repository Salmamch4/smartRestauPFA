<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    public function forgot(Request $request)
    {
        // Validation de l'email
        $this->validate($request, [
            'email' => 'required|email'
        ]);

        $email = $request->email;

        // Vérifier si l'email existe dans la table 'users'
        if (User::where('email', $email)->doesntExist()) {
            return response(['message' => 'Email does not exist.'], 400);
        }

        // Générer un token aléatoire pour la réinitialisation
        $token = Str::random(10);

        // Insérer le token dans la table 'password_resets'
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now()->addHours(6) // Token valable pendant 6 heures
        ]);

        // Envoi de l'email avec le lien de réinitialisation
        Mail::send('mail.password_reset', ['token' => $token], function ($message) use ($email) {
            $message->to($email);
            $message->subject('Reset Your Password');
        });

        return response(['message' => 'Check your email for the password reset link.'], 200);
    }


    public function resetPassword(Request $request, $token)
    {
        // Validation du mot de passe
        $this->validate($request, [
            'password' => 'required|string|confirmed|min:8',
        ]);

        // Vérification du token dans la table password_resets
        $passwordReset = DB::table('password_resets')->where('token', $token)->first();

        if (!$passwordReset) {
            return response(['message' => 'Invalid or expired token.'], 404);
        }

        // Vérifier si le token est toujours valide (valable 6 heures)
        if (now()->diffInHours($passwordReset->created_at) > 6) {
            return response(['message' => 'Token has expired.'], 400);
        }

        // Trouver l'utilisateur avec l'email
        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            return response(['message' => 'User not found.'], 404);
        }

        // Mise à jour du mot de passe
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token de la table password_resets
        DB::table('password_resets')->where('token', $token)->delete();

        return response(['message' => 'Password successfully reset.'], 200);
    }
}
