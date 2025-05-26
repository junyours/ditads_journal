<?php

use App\Http\Controllers\Journal\AdminController;
use App\Http\Controllers\Journal\AuthorController;
use App\Http\Controllers\Journal\EditorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin', 'verified'])->group(function () {
  Route::get('/admin/journal/requests', [AdminController::class, 'getRequest']);
  Route::post('/admin/journal/requests/accept', [AdminController::class, 'acceptRequest']);

  Route::get('/admin/journal/assign-documents/me', [AdminController::class, 'assignDocumentMe']);
  Route::get('/admin/journal/assign-documents/editor', [AdminController::class, 'assignDocumentEditor']);
});

Route::middleware(['auth', 'editor', 'verified'])->group(function () {
  Route::get('/editor/dashboard', [EditorController::class, 'dashboard']);

  Route::get('/editor/journal/assign-documents', [EditorController::class, 'assignDocument']);
});

Route::middleware(['auth', 'author', 'verified'])->group(function () {
  Route::get('/author/dashboard', [AuthorController::class, 'dashboard']);

  Route::get('/author/journal/requests', [AuthorController::class, 'getRequest']);
  Route::post('/author/journal/requests/submit', [AuthorController::class, 'submitJournal']);
  Route::post('/author/journal/requests/add/school', [AuthorController::class, 'addSchool']);
});
