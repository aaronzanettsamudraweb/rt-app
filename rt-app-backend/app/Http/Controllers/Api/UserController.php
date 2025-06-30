<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'ktp_photo' => 'nullable|image|max:2048',
            'status' => 'required|in:tetap,kontrak',
            'phone' => 'required|string',
            'marital_status' => 'required|in:menikah,belum',
        ]);

        if ($request->hasFile('ktp_photo')) {
            $data['ktp_photo'] = $request->file('ktp_photo')->store('ktp', 'public');
        }

        return User::create($data);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'ktp_photo' => 'nullable|image|max:2048',
            'status' => 'sometimes|required|in:tetap,kontrak',
            'phone' => 'sometimes|required|string',
            'marital_status' => 'sometimes|required|in:menikah,belum',
        ]);

        if ($request->hasFile('ktp_photo')) {
            if ($user->ktp_photo) {
                Storage::disk('public')->delete($user->ktp_photo);
            }
            $data['ktp_photo'] = $request->file('ktp_photo')->store('ktp', 'public');
        }

        $user->update($data);
        return $user;
    }

    public function destroy(User $user)
    {
        if ($user->ktp_photo) {
            Storage::disk('public')->delete($user->ktp_photo);
        }

        $user->delete();
        return response()->noContent();
    }
}
