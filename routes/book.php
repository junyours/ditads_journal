<?php

use App\Http\Controllers\Book\CustomerController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer', 'verified'])->group(function () {
  Route::get('/books', [CustomerController::class, 'book']);
  Route::get('/book/{title}/{author}/{cover_file_id}', [CustomerController::class, 'bookDetail']);

  Route::get('/account/profile', [CustomerController::class, 'profile']);
  Route::get('/account/orders', [CustomerController::class, 'order']);

  Route::get('/cart', [CustomerController::class, 'cart']);
  Route::post('/cart/add', [CustomerController::class, 'addCart']);
  Route::post('/cart/remove/{cart_id}', [CustomerController::class, 'removeCart']);
  Route::post('/cart/increment', [CustomerController::class, 'quantityIncrement']);
  Route::post('/cart/decrement', [CustomerController::class, 'quantityDecrement']);

  Route::get('/checkout', [CustomerController::class, 'checkout']);
  Route::post('/checkout/add/delivery-address', [CustomerController::class, 'addDeliveryAddress']);
  Route::post('/checkout/update/delivery-address', [CustomerController::class, 'updateDeliveryAddress']);
  Route::post('/checkout/delete/delivery-address/{address_id}', [CustomerController::class, 'deleteDeliveryAddress']);
  Route::post('/checkout/validate/card-info', [CustomerController::class, 'validateCardInfo']);

  Route::get('/customer/book/sales', [CustomerController::class, 'bookSale']);
  Route::get('/customer/book/sales/buy/{book_id}', [CustomerController::class, 'buyBook']);
  Route::post('/customer/book/pay', [CustomerController::class, 'payBook']);
  Route::get('/customer/book/purchase', [CustomerController::class, 'bookPurchase']);

  Route::get('/customer/transaction/book-orders/hard-bound', [CustomerController::class, 'hardBookOrder']);
  Route::get('/customer/transaction/book-orders/soft-bound', [CustomerController::class, 'softBookOrder']);
});

Route::post('/api/pay-with-card', [PaymentController::class, 'payCard']);
Route::post('/api/pay-via-ewallet', [PaymentController::class, 'payEwallet']);

