<?php

namespace App\Services\ForgotResetPasswordService;
use Illuminate\Support\Facades\Mail;

class SendEmailService implements SendMailInterface
{
    public function sendPasswordResetLink(string $email, string $token): void
    {
        Mail::send('mail.password_reset', ['token' => $token], function ($message) use ($email) {
            $message->to($email);
            $message->subject('Reset Your Password');
        });
    }

}
