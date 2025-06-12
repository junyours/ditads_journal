<?php

use App\Http\Controllers\Book\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer', 'verified'])->group(function () {
  Route::get('/customer/dashboard', [CustomerController::class, 'dashboard']);

  Route::get('/customer/book/sales', [CustomerController::class, 'bookSale']);
  Route::get('/customer/book/purchase', [CustomerController::class, 'bookPurchase']);
});

