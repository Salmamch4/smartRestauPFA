<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\TokenService;

class JwtMiddleware
{
   public function __construct(
    private TokenService $tokenService
   ){}

   public function handler ($request, Closure $next){}
} 