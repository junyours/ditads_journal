<?php

use App\Http\Controllers\Book\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer', 'verified'])->group(function () {
  Route::get('/customer/dashboard', [CustomerController::class, 'dashboard']);

  Route::get('/customer/book/sales', [CustomerController::class, 'bookSale']);
  Route::post('/customer/add/delivery-address', [CustomerController::class, 'addDeliveryAddress']);
  Route::post('/customer/book/pay', [CustomerController::class, 'payBook']);
  Route::get('/customer/book/purchase', [CustomerController::class, 'bookPurchase']);

  Route::get('/customer/transaction/book-orders/hard-bound', [CustomerController::class, 'hardBookOrder']);
  Route::get('/customer/transaction/book-orders/soft-bound', [CustomerController::class, 'softBookOrder']);
});

