<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\ForgotResetPasswordRepository\ForgotPasswordRepositoryInterface;
use App\Repositories\ForgotResetPasswordRepository\ForgotPasswordRepository;
use App\Repositories\ForgotResetPasswordRepository\ResetPasswordRepositoryInterface;
use App\Repositories\ForgotResetPasswordRepository\ResetPasswordRepository;
use App\Services\ForgotResetPasswordService\SendMailInterface;
use App\Services\ForgotResetPasswordService\SendEmailService;
use App\Services\ForgotResetPasswordService\TokenGeneratorInterface;
use App\Services\ForgotResetPasswordService\RandomTokenService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
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
    }

    public function boot(): void
    {
        //
    }
}
