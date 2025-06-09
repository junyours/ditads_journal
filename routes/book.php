<?php

use App\Http\Controllers\Book\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer', 'verified'])->group(function () {
  Route::get('/customer/dashboard', [CustomerController::class, 'dashboard']);
});

