<?php
namespace app\Repositories\Auth;
use app\Models\User;
interface UserRepositoryInterface
{
    public function findByTelephone(string $telephone): ?User;
    public function findById(int $id): ?User;


} 