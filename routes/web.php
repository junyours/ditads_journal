<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin', 'verified'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);

    Route::get('/admin/users/editor', [AdminController::class, 'getEditor']);
    Route::post('/admin/users/editor/add', [AdminController::class, 'addEditor']);
    Route::post('/admin/users/editor/update', [AdminController::class, 'updateEditor']);

    Route::get('/admin/users/author', [AdminController::class, 'getAuthor']);

    Route::get('/admin/web/book-publication', [AdminController::class, 'getBookPublication']);
    Route::post('/admin/web/book-publication/upload', [AdminController::class, 'uploadBookPublication']);
    Route::post('/admin/web/book-publication/update', [AdminController::class, 'updateBookPublication']);

    Route::get('/admin/web/magazine', [AdminController::class, 'getMagazine']);
    Route::post('/admin/web/magazine/upload', [AdminController::class, 'uploadMagazine']);
    Route::post('/admin/web/magazine/update', [AdminController::class, 'updateMagazine']);

    Route::get('/admin/web/research-journal', [AdminController::class, 'getResearchJournal']);

    Route::get('/admin/others/school', [AdminController::class, 'getSchool']);
});

Route::get('/', [WebController::class, 'welcome']);
Route::get('/about-us', [WebController::class, 'aboutUs']);
Route::get('/book-publication', [WebController::class, 'bookPublication']);
Route::get('/magazine', [WebController::class, 'magazine']);
Route::get('/research-journal', [WebController::class, 'researchJournal']);
Route::get('/contact-us', [WebController::class, 'contactUs']);

require __DIR__ . '/auth.php';
require __DIR__ . '/journal.php';
