<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::all(), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255'
        ]);

        $role = Role::create([
            'nom' => $request->nom
        ]);

        return response()->json($role, 201);
    }

    public function show($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        return response()->json($role, 200);
    }

    public function update(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255'
        ]);

        $role->update([
            'nom' => $request->nom
        ]);

        return response()->json($role, 200);
    }

    public function destroy($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $role->delete();

        return response()->json(['message' => 'Deleted successfully'], 200);
    }
}