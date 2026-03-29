<?php

namespace App\Repositories\Auth;

use App\Models\User;
use App\Repositories\Auth\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    protected User $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function findByTelephone(string $telephone): ?User
    {
        return $this->model->where('telephone', $telephone)->first();
    }

    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }

    
}