<?php

namespace App\Providers;

use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
       
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );

     
        $this->app->bind(AuthService::class, function ($app) {
            return new AuthService(
                $app->make(UserRepositoryInterface::class)
            );
        });
    }


    public function boot(): void
    {
        //
    }
}