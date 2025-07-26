<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/mobile/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'The provided credentials are incorrect.'], 422);
    }

    $token = $user->createToken('mobile-token')->plainTextToken;

    return response()->json([
        'token' => $token,
    ]);
});

Route::get('/mobile/logout', function (Request $request) {
    $user = $request->user();

    $user->currentAccessToken()->delete();

    return response()->noContent();
})->middleware('auth:sanctum');
