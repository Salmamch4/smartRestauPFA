<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DTOs\Forgot\ForgotPasswordDTO;
use App\DTOs\Forgot\ResetPasswordDTO;
use App\Repositories\ForgotResetPasswordRepository\ForgotPasswordRepositoryInterface;
use App\Repositories\ForgotResetPasswordRepository\ResetPasswordRepositoryInterface;
use App\Services\ForgotResetPasswordService\SendMailInterface;
use App\Services\ForgotResetPasswordService\TokenGeneratorInterface;

class ForgotPasswordController extends Controller
{
    public function __construct(
        private ForgotPasswordRepositoryInterface $forgotPasswordRepo,
        private ResetPasswordRepositoryInterface $resetPasswordRepo,
        private SendMailInterface $mailService,
        private TokenGeneratorInterface $tokenGenerator
    ) {}

    public function forgot(Request $request)
    {
        // Validation de l'email
        $this->validate($request, [
            'email' => 'required|email'
        ]);

        $dto = ForgotPasswordDTO::fromRequest($request);

        // Vérifier si l'email existe dans la table 'users'
        if (!$this->forgotPasswordRepo->emailExists($dto->email)) {
            return response(['message' => 'Email does not exist.'], 404);
        }

        $this->forgotPasswordRepo->deleteExistingTokens($dto->email);

        // Générer un token aléatoire pour la réinitialisation
        $token = $this->tokenGenerator->generate();

        // Insérer le token dans la table 'password_resets'
        $this->forgotPasswordRepo->createToken($dto->email, $token);

        // Envoi de l'email avec le lien de réinitialisation
        $this->mailService->sendPasswordResetLink($dto->email, $token);

        return response(['message' => 'Check your email for the password reset link.'], 200);
    }

    public function resetPassword(Request $request, $token)
    {
        // Validation du mot de passe
        $this->validate($request, [
            'password' => 'required|string|confirmed|min:8',
        ]);

        $dto = ResetPasswordDTO::fromRequest($request, $token);

        // Vérification du token dans la table password_resets
        $passwordReset = $this->resetPasswordRepo->findByToken($dto->token);

        if (!$passwordReset) {
            return response(['message' => 'Invalid or expired token.'], 404);
        }

        // Vérifier si le token est toujours valide (valable 1H)
        if ($this->resetPasswordRepo->isTokenExpired($passwordReset)) {
            return response(['message' => 'Token has expired.'], 400);
        }

        // Trouver l'utilisateur avec l'email
        $user = $this->resetPasswordRepo->findUserByEmail($passwordReset->email);

        if (!$user) {
            return response(['message' => 'User not found.'], 404);
        }

        // Mise à jour du mot de passe
        $this->resetPasswordRepo->updateUserPassword($user, $dto->password);

        // Supprimer le token de la table password_resets
        $this->resetPasswordRepo->deleteToken($dto->token);

        return response(['message' => 'Password successfully reset.'], 200);
    }















   /* public function forgot(Request $request)
    {
        // Validation de l'email//DTO
        $this->validate($request, [ //DTO
            'email' => 'required|email'
        ]);

        $email = $request->email;

        // Vérifier si l'email existe dans la table 'users'//RepoForgot
        if (User::where('email', $email)->doesntExist()) {
            return response(['message' => 'Email does not exist.'], 400);
        }

        DB::table('password_resets')->where('email', $email)->delete();//RepoForgot

        // Générer un token aléatoire pour la réinitialisation //service
        $token = Str::random(50);

        // Insérer le token dans la table 'password_resets' //RepoForgot
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => now()->addHours(1) // Token valable pendant 1H
        ]);

        // Envoi de l'email avec le lien de réinitialisation //ServiceSendMail
        Mail::send('mail.password_reset', ['token' => $token], function ($message) use ($email) {
            $message->to($email);
            $message->subject('Reset Your Password');
        });

        return response(['message' => 'Check your email for the password reset link.'], 200);
    }


    public function resetPassword(Request $request, $token)
    {
        // Validation du mot de passe//DTO
        $this->validate($request, [
            'password' => 'required|string|confirmed|min:8',
        ]);

        // Vérification du token dans la table password_resets //RepoReset
        $passwordReset = DB::table('password_resets')->where('token', $token)->first();

        if (!$passwordReset) {
            return response(['message' => 'Invalid or expired token.'], 404);
        }

        // Vérifier si le token est toujours valide (valable 1H)
        if (now()->diffInHours($passwordReset->created_at) > 1) {
            return response(['message' => 'Token has expired.'], 400);
        }

        // Trouver l'utilisateur avec l'email //RepoReset
        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            return response(['message' => 'User not found.'], 404);
        }

        // Mise à jour du mot de passe //RepoReset
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token de la table password_resets //RepoReset
        DB::table('password_resets')->where('token', $token)->delete();

        return response(['message' => 'Password successfully reset.'], 200);
    }*/
}
