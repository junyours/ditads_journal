<?php

use App\Http\Controllers\Journal\AuthorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'author', 'verified'])->group(function () {
  Route::get('/author/dashboard', [AuthorController::class, 'dashboard']);

  Route::get('/author/journal/requests', [AuthorController::class, 'request']);
  Route::post('/author/journal/requests/submit', [AuthorController::class, 'submitJournal']);
});
