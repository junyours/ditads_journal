<?php

use App\Http\Controllers\Book\CustomerController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer', 'verified'])->group(function () {
  Route::get('/books', [CustomerController::class, 'book']);
  Route::get('/book/{title}/{author}/{cover_file_id}', [CustomerController::class, 'bookDetail']);
  Route::get('/cart', [CustomerController::class, 'cart']);
  Route::post('/cart/add', [CustomerController::class, 'addCart']);
  Route::post('/cart/remove/{cart_id}', [CustomerController::class, 'removeCart']);
  Route::get('/checkout', [CustomerController::class, 'checkout']);

  Route::get('/customer/book/sales', [CustomerController::class, 'bookSale']);
  Route::get('/customer/book/sales/buy/{book_id}', [CustomerController::class, 'buyBook']);
  Route::post('/customer/add/delivery-address', [CustomerController::class, 'addDeliveryAddress']);
  Route::post('/customer/book/pay', [CustomerController::class, 'payBook']);
  Route::get('/customer/book/purchase', [CustomerController::class, 'bookPurchase']);

  Route::get('/customer/transaction/book-orders/hard-bound', [CustomerController::class, 'hardBookOrder']);
  Route::get('/customer/transaction/book-orders/soft-bound', [CustomerController::class, 'softBookOrder']);
});

Route::post('/api/pay-with-card', [PaymentController::class, 'payCard']);
Route::post('/api/pay-via-ewallet', [PaymentController::class, 'payEwallet']);

