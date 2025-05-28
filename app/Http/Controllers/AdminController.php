<?php

namespace App\Http\Controllers;

use App\Models\BookCategory;
use App\Models\BookPublication;
use App\Models\Magazine;
use App\Models\ResearchJournal;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        // $password = Str::random(8);

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
            'password' => Hash::make('P@ssw0rd'),
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
                Cloudinary::uploadApi()->destroy('ditads/users/avatar/' . $publicId);
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

    public function getConsultant()
    {
        $consultants = User::select('id', 'name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'consultant')
            ->get();

        return Inertia::render('users/consultant', [
            "consultants" => $consultants,
        ]);
    }

    public function addConsultant(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        // $password = Str::random(8);

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
            'password' => Hash::make('P@ssw0rd'),
            'is_default' => 1,
            'role' => 'consultant',
            'position' => $request->position,
            'department' => $request->department,
            'avatar' => $fileUrl,
        ]);
    }

    public function updateConsultant(Request $request)
    {
        $consultant = User::findOrFail($request->id);

        $request->validate([
            'email' => ['required', 'email', 'unique:users,email,' . $request->id],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        $consultant->update([
            'name' => $request->name,
            'email' => $request->email,
            'position' => $request->position,
            'department' => $request->department
        ]);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['mimes:jpeg,jpg,png', 'max:2048']
            ]);

            if ($consultant->avatar) {
                $publicId = pathinfo(parse_url($consultant->avatar, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::uploadApi()->destroy('ditads/users/avatar/' . $publicId);
            }

            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('avatar')->getRealPath(),
                ['folder' => 'ditads/users/avatar']
            );

            $fileUrl = $uploadedFile['secure_url'];

            $consultant->update([
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
        $books = BookPublication::select('id', 'title', 'soft_isbn', 'hard_isbn', 'cover_page', 'author', 'overview', 'published_at', 'pdf_file', 'book_category_id', 'doi')
            ->get();

        $categories = BookCategory::select('id', 'name')->get();

        return Inertia::render('web/admin/book-publication', [
            'books' => $books,
            'categories' => $categories
        ]);
    }

    public function uploadBookPublication(Request $request)
    {
        // $request->validate([
        //     'title' => ['required'],
        //     'soft_isbn' => ['required', 'unique:book_publications'],
        //     'hard_isbn' => ['required', 'unique:book_publications'],
        //     'cover_page' => ['required', 'mimes:jpeg,jpg,png', 'max:3048'],
        //     'author' => ['required'],
        //     'overview' => ['required'],
        //     'published_at' => ['required'],
        //     'pdf_file' => ['required', 'mimes:pdf'],
        //     'book_category_id' => ['required'],
        //     'doi' => ['required'],
        // ], [
        //     'book_category_id.required' => 'The book category field is required.'
        // ]);

        $request->validate([
            'title' => ['required'],
            'soft_isbn' => ['required', 'unique:book_publications'],
            'hard_isbn' => ['nullable', 'unique:book_publications'],
            'cover_page' => ['required', 'mimes:jpeg,jpg,png', 'max:3048'],
            'author' => ['required'],
            'overview' => ['required'],
            'published_at' => ['required']
        ]);

        if ($request->hasFile('cover_page')) {
            $uploadedCoverPage = Cloudinary::uploadApi()->upload(
                $request->file('cover_page')->getRealPath(),
                [
                    'folder' => 'ditads/books/cover_page'
                ]
            );

            $cover_page = $uploadedCoverPage['secure_url'];
        }

        if ($request->hasFile('pdf_file')) {
            $uploadedPdfFile = Cloudinary::uploadApi()->upload(
                $request->file('pdf_file')->getRealPath(),
                [
                    'folder' => 'ditads/books/pdf_file',
                    'resource_type' => 'raw',
                    'format' => 'pdf',
                ]
            );

            $pdf_file = 'v' . $uploadedPdfFile['version'] . '/' . $uploadedPdfFile['public_id'];
        }

        BookPublication::create([
            'title' => $request->title,
            'soft_isbn' => $request->soft_isbn,
            'hard_isbn' => $request->hard_isbn,
            'cover_page' => $cover_page,
            'author' => $request->author,
            'overview' => $request->overview,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
            // 'pdf_file' => $pdf_file,
            // 'book_category_id' => $request->book_category_id,
            // 'doi' => $request->doi,
        ]);
    }

    public function updateBookPublication(Request $request)
    {
        $book = BookPublication::findOrFail($request->id);

        // $request->validate([
        //     'title' => ['required'],
        //     'soft_isbn' => ['required', 'unique:book_publications,soft_isbn,' . $request->id],
        //     'hard_isbn' => ['required', 'unique:book_publications,hard_isbn,' . $request->id],
        //     'author' => ['required'],
        //     'overview' => ['required'],
        //     'published_at' => ['required'],
        //     'book_category_id' => ['required'],
        //     'doi' => ['required'],
        // ], [
        //     'book_category_id.required' => 'The book category field is required.'
        // ]);

        $request->validate([
            'title' => ['required'],
            'soft_isbn' => ['required', 'unique:book_publications,soft_isbn,' . $request->id],
            'hard_isbn' => ['nullable', 'unique:book_publications,hard_isbn,' . $request->id],
            'author' => ['required'],
            'overview' => ['required'],
            'published_at' => ['required']
        ]);

        $book->update([
            'title' => $request->title,
            'soft_isbn' => $request->soft_isbn,
            'hard_isbn' => $request->hard_isbn,
            'author' => $request->author,
            'overview' => $request->overview,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
            // 'book_category_id' => $request->book_category_id,
            // 'doi' => $request->doi,
        ]);

        if ($request->hasFile('cover_page')) {
            $request->validate([
                'cover_page' => ['mimes:jpeg,jpg,png', 'max:3048']
            ]);

            if ($book->cover_page) {
                $publicId = pathinfo(parse_url($book->cover_page, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::uploadApi()->destroy('ditads/books/cover_page/' . $publicId);
            }

            $uploadedCoverPage = Cloudinary::uploadApi()->upload(
                $request->file('cover_page')->getRealPath(),
                ['folder' => 'ditads/books/cover_page']
            );

            $cover_page = $uploadedCoverPage['secure_url'];

            $book->update([
                'cover_page' => $cover_page,
            ]);
        }

        if ($request->hasFile('pdf_file')) {
            $request->validate([
                'pdf_file' => ['required', 'mimes:pdf'],
            ]);

            if ($book->pdf_file) {
                $publicId = explode('/', $book->pdf_file, 2)[1];
                Cloudinary::uploadApi()->destroy($publicId, [
                    'resource_type' => 'raw',
                ]);
            }

            $uploadedPdfFile = Cloudinary::uploadApi()->upload(
                $request->file('pdf_file')->getRealPath(),
                [
                    'folder' => 'ditads/books/pdf_file',
                    'resource_type' => 'raw',
                    'format' => 'pdf',
                ]
            );

            $pdf_file = 'v' . $uploadedPdfFile['version'] . '/' . $uploadedPdfFile['public_id'];

            $book->update([
                'pdf_file' => $pdf_file,
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
                Cloudinary::uploadApi()->destroy('ditads/magazines/cover_page/' . $publicId);
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
            'page_number',
            'tracking_number',
            'doi'
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
            'tracking_number' => ['required', 'unique:research_journals'],
            'doi' => ['required'],
        ]);

        if ($request->hasFile('pdf_file')) {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('pdf_file')->getRealPath(),
                [
                    'folder' => 'ditads/journal/pdf_file',
                    'resource_type' => 'raw',
                    'format' => 'pdf',
                ]
            );

            $fileName = 'v' . $uploadedFile['version'] . '/' . $uploadedFile['public_id'];
        }

        ResearchJournal::create([
            'volume' => $request->volume,
            'issue' => $request->issue,
            'title' => $request->title,
            'author' => $request->author,
            'abstract' => $request->abstract,
            'pdf_file' => $fileName,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
            'country' => $request->country,
            'page_number' => $request->page_number,
            'tracking_number' => $request->tracking_number,
            'doi' => $request->doi
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
            'tracking_number' => ['required', 'unique:research_journals,tracking_number,' . $request->id],
            'doi' => ['required'],
        ]);

        if ($request->hasFile('pdf_file')) {
            $request->validate([
                'pdf_file' => ['mimes:pdf', 'max:2048'],
            ]);
            if ($journal->pdf_file) {
                $publicId = explode('/', $journal->pdf_file, 2)[1];
                Cloudinary::uploadApi()->destroy($publicId, [
                    'resource_type' => 'raw',
                ]);
            }

            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('pdf_file')->getRealPath(),
                [
                    'folder' => 'ditads/journal/pdf_file',
                    'resource_type' => 'raw',
                    'format' => 'pdf',
                ]
            );

            $fileName = 'v' . $uploadedFile['version'] . '/' . $uploadedFile['public_id'];

            $journal->pdf_file = $fileName;
        }

        $journal->update([
            'volume' => $request->volume,
            'issue' => $request->issue,
            'title' => $request->title,
            'author' => $request->author,
            'abstract' => $request->abstract,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
            'country' => $request->country,
            'page_number' => $request->page_number,
            'pdf_file' => $journal->pdf_file,
            'tracking_number' => $request->tracking_number,
            'doi' => $request->doi
        ]);
    }

    public function getSchool()
    {
        $schools = School::select('id', 'name')
            ->get();

        return Inertia::render('others/school', [
            'schools' => $schools
        ]);
    }

    public function addSchool(Request $request)
    {
        $request->validate([
            'name' => ['required', 'unique:schools'],
        ]);

        School::create([
            'name' => $request->name,
        ]);
    }

    public function updateSchool(Request $request)
    {
        $school = School::findOrFail($request->id);

        $request->validate([
            'name' => ['required', 'unique:schools,name,' . $request->id],
        ]);

        $school->update([
            'name' => $request->name,
        ]);
    }

    public function bookCategory()
    {
        $categories = BookCategory::select('id', 'name')->get();

        return Inertia::render('others/book-category', [
            'categories' => $categories
        ]);
    }

    public function AddBookCategory(Request $request)
    {
        $request->validate([
            'name' => ['required', 'unique:book_categories'],
        ]);

        BookCategory::create([
            'name' => $request->name,
        ]);
    }

    public function UpdateBookCategory(Request $request)
    {
        $category = BookCategory::findOrFail($request->id);

        $request->validate([
            'name' => ['required', 'unique:book_categories,name,' . $request->id],
        ]);

        $category->update([
            'name' => $request->name,
        ]);
    }
}
