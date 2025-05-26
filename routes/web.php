<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/settings/profile', [SettingController::class, 'profile']);
    Route::get('/settings/password', [SettingController::class, 'password']);
    Route::post('/settings/password/update', [SettingController::class, 'updatePassword']);
});

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
    Route::post('/admin/web/research-journal/upload', [AdminController::class, 'uploadResearchJournal']);
    Route::post('/admin/web/research-journal/update', [AdminController::class, 'updateResearchJournal']);

    Route::get('/admin/others/schools', [AdminController::class, 'getSchool']);
    Route::post('/admin/others/schools/add', [AdminController::class, 'addSchool']);
    Route::post('/admin/others/schools/update', [AdminController::class, 'updateSchool']);

    Route::get('/admin/others/book-categories', [AdminController::class, 'bookCategory']);
    Route::post('/admin/others/book-categories/add', [AdminController::class, 'AddBookCategory']);
    Route::post('/admin/others/book-categories/update', [AdminController::class, 'UpdateBookCategory']);
});

Route::get('/', [WebController::class, 'welcome']);
Route::get('/about-us', [WebController::class, 'aboutUs']);
Route::get('/book-publication', [WebController::class, 'bookPublication']);
Route::get('/magazine', [WebController::class, 'magazine']);
Route::get('/research-journal', [WebController::class, 'researchJournal']);
Route::get('/IMRJ/{path}', [WebController::class, 'viewJournal'])->where('path', '.*');
Route::get('/view-book/{path}', [WebController::class, 'viewBook'])->where('path', '.*');
Route::get('/contact-us', [WebController::class, 'contactUs']);

require __DIR__ . '/auth.php';
require __DIR__ . '/journal.php';
