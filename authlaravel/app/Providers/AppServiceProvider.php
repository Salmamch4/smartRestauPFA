<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
<<<<<<< HEAD
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
=======
use App\Repositories\ForgotResetPasswordRepository\ForgotPasswordRepositoryInterface;
use App\Repositories\ForgotResetPasswordRepository\ForgotPasswordRepository;
use App\Repositories\ForgotResetPasswordRepository\ResetPasswordRepositoryInterface;
use App\Repositories\ForgotResetPasswordRepository\ResetPasswordRepository;
use App\Services\ForgotResetPasswordService\SendMailInterface;
use App\Services\ForgotResetPasswordService\SendEmailService;
use App\Services\ForgotResetPasswordService\TokenGeneratorInterface;
use App\Services\ForgotResetPasswordService\RandomTokenService;

>>>>>>> feature/auth
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
<<<<<<< HEAD
        
=======
        $this->app->bind(
            ForgotPasswordRepositoryInterface::class,
            ForgotPasswordRepository::class
        );

        $this->app->bind(
            ResetPasswordRepositoryInterface::class,
            ResetPasswordRepository::class
        );

        $this->app->bind(
            SendMailInterface::class,
            SendEmailService::class
        );

        $this->app->bind(
            TokenGeneratorInterface::class,
            RandomTokenService::class
        );
>>>>>>> feature/auth
    }

    public function boot(): void
    {
        //
    }
}
