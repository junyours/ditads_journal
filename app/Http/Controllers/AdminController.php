<?php

namespace App\Http\Controllers;

use App\Models\BookPublication;
use App\Models\Magazine;
use App\Models\ResearchJournal;
use App\Models\User;
use Carbon\Carbon;
use Cloudinary\Api\Upload\UploadApi;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;
use Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('dashboard');
    }

    public function getEditor()
    {
        $editors = User::select('id', 'name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->get();

        return Inertia::render('users/editor', [
            "editors" => $editors,
        ]);
    }

    public function addEditor(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        $password = Str::random(8);

        $fileUrl = null;

        if ($request->hasFile('avatar')) {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('avatar')->getRealPath(),
                ['folder' => 'ditads/users/avatar']
            );

            $fileUrl = $uploadedFile['secure_url'];
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
            'is_default' => 1,
            'role' => 'editor',
            'position' => $request->position,
            'department' => $request->department,
            'avatar' => $fileUrl,
        ]);
    }

    public function updateEditor(Request $request)
    {
        $editor = User::findOrFail($request->id);

        $request->validate([
            'email' => ['required', 'email', 'unique:users,email,' . $request->id],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        $editor->update([
            'name' => $request->name,
            'email' => $request->email,
            'position' => $request->position,
            'department' => $request->department
        ]);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['mimes:jpeg,jpg,png', 'max:2048']
            ]);

            if ($editor->avatar) {
                $publicId = pathinfo(parse_url($editor->avatar, PHP_URL_PATH), PATHINFO_FILENAME);
                (new UploadApi())->destroy('ditads/users/avatar/' . $publicId);
            }

            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('avatar')->getRealPath(),
                ['folder' => 'ditads/users/avatar']
            );

            $fileUrl = $uploadedFile['secure_url'];

            $editor->update([
                'avatar' => $fileUrl,
            ]);
        }
    }

    public function getAuthor()
    {
        return Inertia::render('users/author');
    }

    public function getBookPublication()
    {
        $books = BookPublication::select('id', 'title', 'isbn', 'cover_page', 'author', 'overview', 'created_at')
            ->get();

        return Inertia::render('web/admin/book-publication', [
            'books' => $books
        ]);
    }

    public function uploadBookPublication(Request $request)
    {
        $request->validate([
            'title' => ['required'],
            'isbn' => ['required', 'unique:book_publications'],
            'cover_page' => ['required', 'mimes:jpeg,jpg,png', 'max:3048'],
            'author' => ['required'],
            'overview' => ['required']
        ]);

        $fileUrl = null;

        if ($request->hasFile('cover_page')) {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('cover_page')->getRealPath(),
                ['folder' => 'ditads/books/cover_page']
            );

            $fileUrl = $uploadedFile['secure_url'];
        }

        BookPublication::create([
            'title' => $request->title,
            'isbn' => $request->isbn,
            'cover_page' => $fileUrl,
            'author' => $request->author,
            'overview' => $request->overview,
        ]);
    }

    public function updateBookPublication(Request $request)
    {
        $book = BookPublication::findOrFail($request->id);

        $request->validate([
            'title' => ['required'],
            'isbn' => ['required', 'unique:book_publications,isbn,' . $request->id],
            'author' => ['required'],
            'overview' => ['required']
        ]);

        $book->update([
            'title' => $request->title,
            'isbn' => $request->isbn,
            'author' => $request->author,
            'overview' => $request->overview,
        ]);

        if ($request->hasFile('cover_page')) {
            $request->validate([
                'cover_page' => ['mimes:jpeg,jpg,png', 'max:3048']
            ]);

            if ($book->cover_page) {
                $publicId = pathinfo(parse_url($book->cover_page, PHP_URL_PATH), PATHINFO_FILENAME);
                (new UploadApi())->destroy('ditads/books/cover_page/' . $publicId);
            }

            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('cover_page')->getRealPath(),
                ['folder' => 'ditads/books/cover_page']
            );

            $fileUrl = $uploadedFile['secure_url'];

            $book->update([
                'cover_page' => $fileUrl,
            ]);
        }
    }

    public function getMagazine()
    {
        $magazines = Magazine::select('id', 'cover_page', 'volume', 'issue', 'created_at')
            ->get();

        return Inertia::render('web/admin/magazine', [
            'magazines' => $magazines
        ]);
    }

    public function uploadMagazine(Request $request)
    {
        $request->validate([
            'cover_page' => ['required', 'mimes:jpeg,jpg,png', 'max:3048'],
            'volume' => ['required'],
            'issue' => ['required']
        ]);

        $fileUrl = null;

        if ($request->hasFile('cover_page')) {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('cover_page')->getRealPath(),
                ['folder' => 'ditads/magazines/cover_page']
            );

            $fileUrl = $uploadedFile['secure_url'];
        }

        Magazine::create([
            'cover_page' => $fileUrl,
            'volume' => $request->volume,
            'issue' => $request->issue,
        ]);
    }

    public function updateMagazine(Request $request)
    {
        $magazine = Magazine::findOrFail($request->id);

        $request->validate([
            'volume' => ['required'],
            'issue' => ['required']
        ]);

        $magazine->update([
            'volume' => $request->volume,
            'issue' => $request->issue,
        ]);

        if ($request->hasFile('cover_page')) {
            $request->validate([
                'cover_page' => ['mimes:jpeg,jpg,png', 'max:3048']
            ]);

            if ($magazine->cover_page) {
                $publicId = pathinfo(parse_url($magazine->cover_page, PHP_URL_PATH), PATHINFO_FILENAME);
                (new UploadApi())->destroy('ditads/magazines/cover_page/' . $publicId);
            }

            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('cover_page')->getRealPath(),
                ['folder' => 'ditads/magazines/cover_page']
            );

            $fileUrl = $uploadedFile['secure_url'];

            $magazine->update([
                'cover_page' => $fileUrl,
            ]);
        }
    }

    public function getResearchJournal()
    {
        $journals = ResearchJournal::select(
            'id',
            'volume',
            'issue',
            'title',
            'author',
            'abstract',
            'pdf_file',
            'published_at',
            'country',
            'page_number'
        )
            ->get();

        return Inertia::render('web/admin/research-journal', [
            'journals' => $journals
        ]);
    }

    public function uploadResearchJournal(Request $request)
    {
        $request->validate([
            'volume' => ['required'],
            'issue' => ['required'],
            'title' => ['required'],
            'author' => ['required'],
            'abstract' => ['required'],
            'pdf_file' => ['required', 'mimes:pdf', 'max:2048'],
            'published_at' => ['required'],
            'country' => ['required'],
            'page_number' => ['required'],
        ]);

        $fileUrl = null;

        if ($request->hasFile('pdf_file')) {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('pdf_file')->getRealPath(),
                [
                    'folder' => 'ditads/journal/pdf_file',
                ]
            );

            $fileUrl = $uploadedFile['secure_url'];
        }

        ResearchJournal::create([
            'volume' => $request->volume,
            'issue' => $request->issue,
            'title' => $request->title,
            'author' => $request->author,
            'abstract' => $request->abstract,
            'pdf_file' => $fileUrl,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
            'country' => $request->country,
            'page_number' => $request->page_number,
        ]);
    }

    public function updateResearchJournal(Request $request)
    {
        $journal = ResearchJournal::findOrFail($request->id);

        $request->validate([
            'volume' => ['required'],
            'issue' => ['required'],
            'title' => ['required'],
            'author' => ['required'],
            'abstract' => ['required'],
            'published_at' => ['required'],
            'country' => ['required'],
            'page_number' => ['required'],
        ]);

        $journal->update([
            'volume' => $request->volume,
            'issue' => $request->issue,
            'title' => $request->title,
            'author' => $request->author,
            'abstract' => $request->abstract,
            'published_at' => Carbon::parse($request->published_at)->format('Y-m-d'),
            'country' => $request->country,
            'page_number' => $request->page_number,
        ]);
    }

    public function getSchool()
    {
        return Inertia::render('others/school');
    }
}
