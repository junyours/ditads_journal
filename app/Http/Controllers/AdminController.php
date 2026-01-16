<?php

namespace App\Http\Controllers;

use App\Models\ApplicantTraining;
use App\Models\AuthorBook;
use App\Models\BookCategory;
use App\Models\BookMonitoring;
use App\Models\BookPublication;
use App\Models\CooperativeTraining;
use App\Models\Event;
use App\Models\JournalMonitoring;
use App\Models\Magazine;
use App\Models\PaymentMethod;
use App\Models\ResearchJournal;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use DB;
use Hash;
use Http;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $journals = ResearchJournal::select(
            DB::raw("DATE(published_at) as date"),
            DB::raw("type"),
            DB::raw("COUNT(*) as count")
        )
            ->groupBy(DB::raw("DATE(published_at)"), "type")
            ->orderBy("date")
            ->get()
            ->groupBy('date');

        $chartData = [];

        foreach ($journals as $date => $items) {
            $entry = ['date' => $date, 'imrj' => 0, 'jebmpa' => 0];

            foreach ($items as $journal) {
                $entry[$journal->type] = $journal->count;
            }

            $chartData[] = $entry;
        }

        return Inertia::render('dashboard', [
            'chartData' => $chartData,
        ]);
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
        $accessToken = $this->token();

        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        if ($request->hasFile('avatar')) {
            $ditadsFolderId = config('services.google.folder_id');

            $usersFolderId = $this->getOrCreateFolder($accessToken, 'users', $ditadsFolderId);
            $avatarsFolderId = $this->getOrCreateFolder($accessToken, 'avatars', $usersFolderId);

            $file = $request->file('avatar');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$avatarsFolderId],
            ];

            $uploadResponse = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadResponse->successful()) {
                $fileId = $uploadResponse->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $avatarUrl = "https://drive.google.com/thumbnail?id={$fileId}";
            }
        }

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'email_verified_at' => now(),
            'password' => Hash::make('P@ssw0rd'),
            'is_default' => 1,
            'role' => 'editor',
            'position' => $data['position'],
            'department' => $data['department'],
            'avatar' => $avatarUrl ?? null,
            'file_id' => $fileId ?? null,
        ]);
    }

    public function updateEditor(Request $request)
    {
        $editor = User::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users,email,' . $request->input('id')],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        $editor->query()->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'position' => $data['position'],
            'department' => $data['department'],
        ]);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['mimes:jpeg,jpg,png', 'max:2048']
            ]);

            if ($editor->file_id) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$editor->file_id}");
            }

            $ditadsFolderId = config('services.google.folder_id');
            $usersFolderId = $this->getOrCreateFolder($accessToken, 'users', $ditadsFolderId);
            $avatarsFolderId = $this->getOrCreateFolder($accessToken, 'avatars', $usersFolderId);

            $file = $request->file('avatar');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$avatarsFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $avatarUrl = "https://drive.google.com/thumbnail?id={$fileId}";

                $editor->query()->update([
                    'avatar' => $avatarUrl,
                    'file_id' => $fileId,
                ]);
            }
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
        $accessToken = $this->token();

        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        if ($request->hasFile('avatar')) {
            $ditadsFolderId = config('services.google.folder_id');
            $usersFolderId = $this->getOrCreateFolder($accessToken, 'users', $ditadsFolderId);
            $avatarsFolderId = $this->getOrCreateFolder($accessToken, 'avatars', $usersFolderId);

            $file = $request->file('avatar');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$avatarsFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $avatarUrl = "https://drive.google.com/thumbnail?id={$fileId}";
            }
        }

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'email_verified_at' => now(),
            'password' => Hash::make('P@ssw0rd'),
            'is_default' => 1,
            'role' => 'consultant',
            'position' => $data['position'],
            'department' => $data['department'],
            'avatar' => $avatarUrl ?? null,
            'file_id' => $fileId ?? null
        ]);
    }

    public function updateConsultant(Request $request)
    {
        $consultant = User::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users,email,' . $request->input('id')],
            'name' => ['required'],
            'position' => ['required'],
            'department' => ['required'],
        ]);

        $consultant->query()->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'position' => $data['position'],
            'department' => $data['department']
        ]);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['mimes:jpeg,jpg,png', 'max:2048']
            ]);

            if ($consultant->file_id) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$consultant->file_id}");
            }

            $ditadsFolderId = config('services.google.folder_id');
            $usersFolderId = $this->getOrCreateFolder($accessToken, 'users', $ditadsFolderId);
            $avatarsFolderId = $this->getOrCreateFolder($accessToken, 'avatars', $usersFolderId);

            $file = $request->file('avatar');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$avatarsFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $avatarUrl = "https://drive.google.com/thumbnail?id={$fileId}";

                $consultant->query()->update([
                    'avatar' => $avatarUrl,
                    'file_id' => $fileId
                ]);
            }
        }
    }

    public function getAuthor()
    {
        $authors = User::select('id', 'name', 'email', 'avatar')
            ->where('role', 'author')
            ->get();

        return Inertia::render('users/author', [
            'authors' => $authors
        ]);
    }

    public function addAuthor(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'name' => ['required']
        ]);

        if ($request->hasFile('avatar')) {
            $ditadsFolderId = config('services.google.folder_id');
            $usersFolderId = $this->getOrCreateFolder($accessToken, 'users', $ditadsFolderId);
            $avatarsFolderId = $this->getOrCreateFolder($accessToken, 'avatars', $usersFolderId);

            $file = $request->file('avatar');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$avatarsFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $avatarUrl = "https://drive.google.com/thumbnail?id={$fileId}";
            }
        }

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'email_verified_at' => now(),
            'password' => Hash::make('P@ssw0rd'),
            'is_default' => 1,
            'role' => 'author',
            'avatar' => $avatarUrl ?? null,
            'file_id' => $fileId ?? null
        ]);
    }

    public function updateAuthor(Request $request)
    {
        $author = User::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users,email,' . $request->input('id')],
            'name' => ['required']
        ]);

        $author->query()->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['mimes:jpeg,jpg,png', 'max:2048']
            ]);

            if ($author->file_id) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$author->file_id}");
            }

            $ditadsFolderId = config('services.google.folder_id');
            $usersFolderId = $this->getOrCreateFolder($accessToken, 'users', $ditadsFolderId);
            $avatarsFolderId = $this->getOrCreateFolder($accessToken, 'avatars', $usersFolderId);

            $file = $request->file('avatar');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$avatarsFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $avatarUrl = "https://drive.google.com/thumbnail?id={$fileId}";

                $author->query()->update([
                    'avatar' => $avatarUrl,
                    'file_id' => $fileId
                ]);
            }
        }
    }

    public function getBookPublication(Request $request)
    {
        $search = $request->input('search');

        $books = BookPublication::select('id', 'title', 'soft_isbn', 'hard_isbn', 'cover_page', 'author', 'overview', 'published_at', 'pdf_file', 'book_category_id', 'doi', 'overview_pdf_file', 'hard_price', 'open_access')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->orderByDesc('published_at')
            ->paginate(50);

        $categories = BookCategory::select('id', 'name')->get();

        $authors = User::select('id', 'name', 'avatar')
            ->with([
                'author_book' => function ($query) {
                    $query->select('author_id', 'book_publication_id');
                },
            ])
            ->where('role', 'author')
            ->get();

        return Inertia::render('web/admin/book-publication', [
            'search' => $search,
            'books' => $books,
            'categories' => $categories,
            'authors' => $authors
        ]);
    }

    public function uploadBookPublication(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'title' => ['required'],
            'soft_isbn' => ['required', 'unique:book_publications'],
            'hard_isbn' => ['nullable', 'unique:book_publications'],
            'cover_page' => ['required', 'mimes:jpeg,jpg,png', 'max:3048'],
            'author' => ['required'],
            'overview' => ['required'],
            'published_at' => ['required'],
            'pdf_file' => ['required', 'mimes:pdf'],
            // 'book_category_id' => ['required'],
            'doi' => ['required'],
            // 'overview_pdf_file' => ['required', 'mimes:pdf'],
            'hard_price' => ['required'],
            // 'soft_price' => ['required'],
        ], [
            // 'book_category_id.required' => 'The book category field is required.',
            'pdf_file.required' => 'The book pdf file field is required.',
            'hard_price.required' => 'The price field is required.',
            // 'soft_price.required' => 'The soft bound price field is required.'
        ]);

        if ($request->hasFile('cover_page')) {
            $ditadsFolderId = config('services.google.folder_id');
            $booksFolderId = $this->getOrCreateFolder($accessToken, 'books', $ditadsFolderId);
            $coverPagesFolderId = $this->getOrCreateFolder($accessToken, 'cover_pages', $booksFolderId);

            $file = $request->file('cover_page');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$coverPagesFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $coverFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$coverFileId}", [
                    'name' => $coverFileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$coverFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $coverPageUrl = "https://drive.google.com/thumbnail?id={$coverFileId}";
            }
        }

        if ($request->hasFile('pdf_file')) {
            $parentFolderId = config('services.google.folder_id');
            $booksFolderId = $this->getOrCreateFolder($accessToken, 'books', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'pdf_files', $booksFolderId);

            $file = $request->file('pdf_file');
            $mimeType = $file->getMimeType();

            $tempMetadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($tempMetadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $pdfFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$pdfFileId}", [
                    'name' => "{$pdfFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$pdfFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);
            }
        }

        if ($request->hasFile('overview_pdf_file')) {
            $parentFolderId = config('services.google.folder_id');
            $booksFolderId = $this->getOrCreateFolder($accessToken, 'books', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'overview_pdf_files', $booksFolderId);

            $file = $request->file('overview_pdf_file');
            $mimeType = $file->getMimeType();

            $tempMetadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($tempMetadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $overviewPdfFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$overviewPdfFileId}", [
                    'name' => "{$overviewPdfFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$overviewPdfFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);
            }
        }

        BookPublication::create([
            'title' => $data['title'],
            'soft_isbn' => $data['soft_isbn'],
            'hard_isbn' => $data['hard_isbn'],
            'cover_page' => $coverPageUrl,
            'cover_file_id' => $coverFileId,
            'author' => $data['author'],
            'overview' => $data['overview'],
            'published_at' => Carbon::parse($data['published_at'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'pdf_file' => $pdfFileId,
            // 'book_category_id' => $request->book_category_id,
            'doi' => $data['doi'],
            // 'overview_pdf_file' => $overviewPdfFileId,
            'hard_price' => $data['hard_price'],
            // 'soft_price' => $request->soft_price,
            'open_access' => $request->input('open_access'),
        ]);
    }

    public function updateBookPublication(Request $request)
    {
        $book = BookPublication::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'title' => ['required'],
            'soft_isbn' => ['required', 'unique:book_publications,soft_isbn,' . $request->input('id')],
            'hard_isbn' => ['nullable', 'unique:book_publications,hard_isbn,' . $request->input('id')],
            'author' => ['required'],
            'overview' => ['required'],
            'published_at' => ['required'],
            // 'book_category_id' => ['required'],
            'doi' => ['required'],
            'hard_price' => ['required'],
            // 'soft_price' => ['required'],
        ], [
            // 'book_category_id.required' => 'The book category field is required.',
            'hard_price.required' => 'The price field is required.',
            // 'soft_price.required' => 'The soft bound price field is required.'
        ]);

        $book->query()->update([
            'title' => $data['title'],
            'soft_isbn' => $data['soft_isbn'],
            'hard_isbn' => $data['hard_isbn'],
            'author' => $data['author'],
            'overview' => $data['overview'],
            'published_at' => Carbon::parse($data['published_at'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            // 'book_category_id' => $request->book_category_id,
            'doi' => $data['doi'],
            'hard_price' => $data['hard_price'],
            // 'soft_price' => $request->soft_price,
            'open_access' => $request->input('open_access'),
        ]);

        if ($request->hasFile('cover_page')) {
            $request->validate([
                'cover_page' => ['mimes:jpeg,jpg,png', 'max:3048']
            ]);

            if ($book->cover_file_id) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$book->cover_file_id}");
            }

            $ditadsFolderId = config('services.google.folder_id');
            $booksFolderId = $this->getOrCreateFolder($accessToken, 'books', $ditadsFolderId);
            $coverPagesFolderId = $this->getOrCreateFolder($accessToken, 'cover_pages', $booksFolderId);

            $file = $request->file('cover_page');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$coverPagesFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $coverFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$coverFileId}", [
                    'name' => $coverFileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$coverFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $coverPageUrl = "https://drive.google.com/thumbnail?id={$coverFileId}";

                $book->query()->update([
                    'cover_page' => $coverPageUrl,
                    'cover_file_id' => $coverFileId
                ]);
            }
        }

        if ($request->hasFile('pdf_file')) {
            $request->validate([
                'pdf_file' => ['required', 'mimes:pdf'],
            ], [
                'pdf_file.required' => 'The book pdf file field is required.'
            ]);

            $parentFolderId = config('services.google.folder_id');
            $booksFolderId = $this->getOrCreateFolder($accessToken, 'books', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'pdf_files', $booksFolderId);

            $file = $request->file('pdf_file');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $upload = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($upload->successful()) {
                $newPdfFileId = $upload->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$newPdfFileId}", [
                    'name' => "{$newPdfFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$newPdfFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$book->pdf_file}");

                $book->query()->update([
                    'pdf_file' => $newPdfFileId,
                ]);
            }
        }

        if ($request->hasFile('overview_pdf_file')) {
            $request->validate([
                'overview_pdf_file' => ['required', 'mimes:pdf'],
            ]);

            $parentFolderId = config('services.google.folder_id');
            $booksFolderId = $this->getOrCreateFolder($accessToken, 'books', $parentFolderId);
            $overviewPdfFolderId = $this->getOrCreateFolder($accessToken, 'overview_pdf_files', $booksFolderId);

            $file = $request->file('overview_pdf_file');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$overviewPdfFolderId],
            ];

            $upload = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($upload->successful()) {
                $newOverviewPdfFileId = $upload->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$newOverviewPdfFileId}", [
                    'name' => "{$newOverviewPdfFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$newOverviewPdfFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$book->overview_pdf_file}");

                $book->query()->update([
                    'overview_pdf_file' => $newOverviewPdfFileId,
                ]);
            }
        }
    }

    public function linkAuthorBook(Request $request)
    {
        AuthorBook::query()->where('book_publication_id', $request->input('book_id'))->delete();

        foreach ($request->input('author_id') as $authorId) {
            AuthorBook::create(attributes: [
                'author_id' => $authorId,
                'book_publication_id' => $request->input('book_id'),
            ]);
        }
    }

    public function getMagazine()
    {
        $magazines = Magazine::select('id', 'cover_page', 'volume', 'issue', 'published_at', 'pdf_file')
            ->get();

        return Inertia::render('web/admin/magazine', [
            'magazines' => $magazines
        ]);
    }

    public function uploadMagazine(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'cover_page' => ['required', 'mimes:jpeg,jpg,png'],
            'volume' => ['required'],
            'issue' => ['required'],
            'pdf_file' => ['required', 'mimes:pdf'],
            'published_at' => ['required'],
        ]);

        if ($request->hasFile('cover_page')) {
            $ditadsFolderId = config('services.google.folder_id');
            $magazinesFolderId = $this->getOrCreateFolder($accessToken, 'magazines', $ditadsFolderId);
            $coverPagesFolderId = $this->getOrCreateFolder($accessToken, 'cover_pages', $magazinesFolderId);

            $file = $request->file('cover_page');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$coverPagesFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $coverFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$coverFileId}", [
                    'name' => $coverFileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$coverFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $coverPageUrl = "https://drive.google.com/thumbnail?id={$coverFileId}";
            }
        }

        if ($request->hasFile('pdf_file')) {
            $parentFolderId = config('services.google.folder_id');
            $magazinesFolderId = $this->getOrCreateFolder($accessToken, 'magazines', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'pdf_files', $magazinesFolderId);

            $file = $request->file('pdf_file');
            $mimeType = $file->getMimeType();

            $tempMetadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($tempMetadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => "{$fileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);
            }
        }

        Magazine::create([
            'cover_page' => $coverPageUrl,
            'volume' => $data['volume'],
            'issue' => $data['issue'],
            'pdf_file' => $fileId,
            'cover_file_id' => $coverFileId,
            'published_at' => Carbon::parse($data['published_at'])
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);
    }

    public function updateMagazine(Request $request)
    {
        $magazine = Magazine::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'volume' => ['required'],
            'issue' => ['required'],
            'published_at' => ['required'],
        ]);

        $magazine->query()->update([
            'volume' => $data['volume'],
            'issue' => $data['issue'],
            'published_at' => Carbon::parse($data['published_at'])
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);

        if ($request->hasFile('cover_page')) {
            $request->validate([
                'cover_page' => ['mimes:jpeg,jpg,png']
            ]);

            if ($magazine->cover_file_id) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$magazine->cover_file_id}");
            }

            $ditadsFolderId = config('services.google.folder_id');
            $magazinesFolderId = $this->getOrCreateFolder($accessToken, 'magazines', $ditadsFolderId);
            $coverPagesFolderId = $this->getOrCreateFolder($accessToken, 'cover_pages', $magazinesFolderId);

            $file = $request->file('cover_page');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$coverPagesFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $coverFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$coverFileId}", [
                    'name' => $coverFileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$coverFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $coverPageUrl = "https://drive.google.com/thumbnail?id={$coverFileId}";

                $magazine->query()->update([
                    'cover_page' => $coverPageUrl,
                    'cover_file_id' => $coverFileId
                ]);
            }
        }

        if ($request->hasFile('pdf_file')) {
            $request->validate([
                'pdf_file' => ['required', 'mimes:pdf'],
            ], [
                'pdf_file.required' => 'The magazine pdf file field is required.'
            ]);

            $parentFolderId = config('services.google.folder_id');
            $magazinesFolderId = $this->getOrCreateFolder($accessToken, 'magazines', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'pdf_files', $magazinesFolderId);

            $file = $request->file('pdf_file');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $upload = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($upload->successful()) {
                $newPdfFileId = $upload->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$newPdfFileId}", [
                    'name' => "{$newPdfFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$newPdfFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$magazine->pdf_file}");

                $magazine->query()->update([
                    'pdf_file' => $newPdfFileId,
                ]);
            }
        }
    }

    public function getIMRJ(Request $request)
    {
        $search = $request->input('search');

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
            'doi',
            'type'
        )
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->where('type', 'imrj')
            ->orderByDesc('published_at')
            ->paginate(50);

        return Inertia::render('web/admin/research-journal/imrj', [
            'search' => $search,
            'journals' => $journals
        ]);
    }

    public function getJEBMPA(Request $request)
    {
        $search = $request->input('search');

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
            'doi',
            'type'
        )
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->where('type', 'jebmpa')
            ->orderByDesc('published_at')
            ->paginate(50);

        return Inertia::render('web/admin/research-journal/jebmpa', [
            'search' => $search,
            'journals' => $journals
        ]);
    }

    public function uploadResearchJournal(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'volume' => ['required'],
            'issue' => ['required'],
            'title' => ['required'],
            'author' => ['required'],
            'abstract' => ['required'],
            'pdf_file' => ['required', 'mimes:pdf'],
            'published_at' => ['required'],
            'country' => ['required'],
            'page_number' => ['required'],
            'tracking_number' => ['required', 'unique:research_journals'],
            'doi' => ['required'],
        ]);

        if ($request->hasFile('pdf_file')) {
            $parentFolderId = config('services.google.folder_id');
            $journalsFolderId = $this->getOrCreateFolder($accessToken, 'journals', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'pdf_files', $journalsFolderId);

            $file = $request->file('pdf_file');
            $mimeType = $file->getMimeType();

            $tempMetadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($tempMetadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => "{$fileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);
            }
        }

        ResearchJournal::create([
            'volume' => $data['volume'],
            'issue' => $data['issue'],
            'title' => $data['title'],
            'author' => $data['author'],
            'abstract' => $data['abstract'],
            'pdf_file' => $fileId,
            'published_at' => Carbon::parse($data['published_at'])->timezone('Asia/Manila')->toDateString(),
            'country' => $data['country'],
            'page_number' => $data['page_number'],
            'tracking_number' => $data['tracking_number'],
            'doi' => $data['doi'],
            'type' => $request->input('type')
        ]);
    }

    public function updateResearchJournal(Request $request)
    {
        $journal = ResearchJournal::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'volume' => ['required'],
            'issue' => ['required'],
            'title' => ['required'],
            'author' => ['required'],
            'abstract' => ['required'],
            'published_at' => ['required'],
            'country' => ['required'],
            'page_number' => ['required'],
            'tracking_number' => ['required', 'unique:research_journals,tracking_number,' . $request->input('id')],
            'doi' => ['required'],
        ]);

        $oldFileId = $journal->pdf_file;
        $newFileId = $oldFileId;

        if ($request->hasFile('pdf_file')) {
            $request->validate([
                'pdf_file' => ['mimes:pdf'],
            ]);

            $parentFolderId = config('services.google.folder_id');
            $journalsFolderId = $this->getOrCreateFolder($accessToken, 'journals', $parentFolderId);
            $pdfFolderId = $this->getOrCreateFolder($accessToken, 'pdf_files', $journalsFolderId);

            $file = $request->file('pdf_file');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$pdfFolderId],
            ];

            $upload = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($upload->successful()) {
                $newFileId = $upload->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$newFileId}", [
                    'name' => "{$newFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$newFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                if ($oldFileId && $oldFileId !== $newFileId) {
                    Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$oldFileId}");
                }
            }
        }

        $journal->query()->update([
            'volume' => $data['volume'],
            'issue' => $data['issue'],
            'title' => $data['title'],
            'author' => $data['author'],
            'abstract' => $data['abstract'],
            'published_at' => Carbon::parse($data['published_at'])->timezone('Asia/Manila')->toDateString(),
            'country' => $data['country'],
            'page_number' => $data['page_number'],
            'pdf_file' => $newFileId,
            'tracking_number' => $data['tracking_number'],
            'doi' => $data['doi']
        ]);
    }

    public function deleteResearchJournal(Request $request)
    {
        $journal = ResearchJournal::findOrFail($request->input('id'));
        $accessToken = $this->token();

        if ($journal->pdf_file) {
            Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$journal->pdf_file}");
        }

        $journal->query()->delete();
    }

    public function event()
    {
        $events = Event::select('id', 'title', 'content', 'image', 'date')
            ->get();

        return Inertia::render('web/admin/event', [
            'events' => $events
        ]);
    }

    public function uploadEvent(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'image' => ['required', 'mimes:jpeg,jpg,png'],
            'title' => ['required'],
            'contents' => ['required'],
            'date' => ['required'],
        ]);

        if ($request->hasFile('image')) {
            $ditadsFolderId = config('services.google.folder_id');
            $eventsFolderId = $this->getOrCreateFolder($accessToken, 'events', $ditadsFolderId);
            $imageFolderId = $this->getOrCreateFolder($accessToken, 'images', $eventsFolderId);

            $file = $request->file('image');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$imageFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $imageFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$imageFileId}", [
                    'name' => $imageFileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$imageFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $imageUrl = "https://drive.google.com/thumbnail?id={$imageFileId}";
            }
        }

        Event::create([
            'image' => $imageUrl,
            'image_file_id' => $imageFileId,
            'title' => $data['title'],
            'content' => $data['contents'],
            'date' => Carbon::parse($data['date'])
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);
    }

    public function updateEvent(Request $request)
    {
        $event = Event::findOrFail($request->input('id'));
        $accessToken = $this->token();

        $data = $request->validate([
            'title' => ['required'],
            'contents' => ['required'],
            'date' => ['required'],
        ]);

        $event->query()->update([
            'title' => $data['title'],
            'content' => $data['contents'],
            'date' => Carbon::parse($data['date'])
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => ['mimes:jpeg,jpg,png']
            ]);

            if ($event->image_file_id) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$event->image_file_id}");
            }

            $ditadsFolderId = config('services.google.folder_id');
            $eventsFolderId = $this->getOrCreateFolder($accessToken, 'events', $ditadsFolderId);
            $imageFolderId = $this->getOrCreateFolder($accessToken, 'images', $eventsFolderId);

            $file = $request->file('image');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$imageFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $imageFileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$imageFileId}", [
                    'name' => $imageFileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$imageFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $imageUrl = "https://drive.google.com/thumbnail?id={$imageFileId}";

                $event->query()->update([
                    'image' => $imageUrl,
                    'image_file_id' => $imageFileId,
                ]);
            }
        }
    }

    public function cooperativeTraining()
    {
        $trainings = CooperativeTraining::query()
            ->select('id', 'event_name', 'from_date', 'to_date', 'description')
            ->orderByDesc('from_date')
            ->orderByDesc('to_date')
            ->get();

        return Inertia::render('web/admin/training/cooperative-training', [
            'trainings' => $trainings
        ]);
    }

    public function trainingApplicant($event_name)
    {
        $training = CooperativeTraining::query()->where('event_name', $event_name)
            ->with('applicant_training.applicant')
            ->firstOrFail();

        $review_training = $training->applicant_training->where('status', 'under_review')->values();
        $approve_training = $training->applicant_training->where('status', 'approved')->values();

        return Inertia::render('web/admin/training/cooperative-applicant', [
            'training' => $training,
            'review_training' => $review_training,
            'approve_training' => $approve_training,
        ]);
    }

    public function applicantApproved($id)
    {
        $applicant = ApplicantTraining::findOrFail($id);

        $applicant->query()->update([
            'status' => 'approved'
        ]);
    }

    public function uploadTraining(Request $request)
    {
        $data = $request->validate([
            'event_name' => ['required'],
            'description' => ['required'],
            'from_date' => ['required'],
            'to_date' => ['required'],
        ]);

        CooperativeTraining::create([
            'event_name' => $data['event_name'],
            'description' => $data['description'],
            'from_date' => Carbon::parse($data['from_date'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'to_date' => Carbon::parse($data['to_date'])
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);
    }

    public function updateTraining(Request $request)
    {
        $training = CooperativeTraining::findOrFail($request->input('id'));

        $data = $request->validate([
            'event_name' => ['required'],
            'description' => ['required'],
            'from_date' => ['required'],
            'to_date' => ['required'],
        ]);

        $training->query()->update([
            'event_name' => $data['event_name'],
            'description' => $data['description'],
            'from_date' => Carbon::parse($data['from_date'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'to_date' => Carbon::parse($data['to_date'])
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);
    }

    public function monitoringJournal(Request $request)
    {
        $search = $request->input('search');

        $journals = JournalMonitoring::query()->when($search, function ($query, $search) {
            $query->where('submission', 'like', "%{$search}%");
        })
            ->paginate(10);

        return Inertia::render('web/admin/monitoring/journal', [
            'search' => $search,
            'journals' => $journals
        ]);
    }

    public function addMonitoringJournal(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'submission' => ['required'],
            'institution' => ['required'],
            'paper_type' => ['required'],
            'paper_file' => ['required', 'mimes:pdf'],
            'date_accomplished' => ['required'],
            'status_whole_paper' => ['required'],
            'urgency' => ['required'],
            'processing_status' => ['required'],
            'date_published' => ['required'],
            'doi' => ['required'],
        ]);

        if ($request->hasFile('paper_file')) {
            $parentFolderId = config('services.google.folder_id');
            $monitoringFolderId = $this->getOrCreateFolder($accessToken, 'monitoring', $parentFolderId);
            $paperFileFolderId = $this->getOrCreateFolder($accessToken, 'paper_files', $monitoringFolderId);

            $file = $request->file('paper_file');
            $mimeType = $file->getMimeType();

            $tempMetadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$paperFileFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($tempMetadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => "{$fileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);
            }
        }

        JournalMonitoring::create([
            'submission' => $data['submission'],
            'institution' => $data['institution'],
            'paper_type' => $data['paper_type'],
            'paper_file' => $fileId,
            'date_accomplished' => Carbon::parse($data['date_accomplished'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'status_whole_paper' => $data['status_whole_paper'],
            'urgency' => $data['urgency'],
            'processing_status' => $data['processing_status'],
            'date_published' => Carbon::parse($data['date_published'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'doi' => $data['doi'],
        ]);
    }

    public function updateMonitoringJournal(Request $request)
    {
        $accessToken = $this->token();

        $journal = JournalMonitoring::findOrFail($request->input('id'));

        $data = $request->validate([
            'submission' => ['required'],
            'institution' => ['required'],
            'paper_type' => ['required'],
            'date_accomplished' => ['required'],
            'status_whole_paper' => ['required'],
            'urgency' => ['required'],
            'processing_status' => ['required'],
            'date_published' => ['required'],
            'doi' => ['required'],
        ]);

        $oldFileId = $journal->paper_file;
        $newFileId = $oldFileId;

        if ($request->hasFile('paper_file')) {
            $request->validate(rules: [
                'paper_file' => ['required', 'mimes:pdf'],
            ]);

            $parentFolderId = config('services.google.folder_id');
            $monitoringFolderId = $this->getOrCreateFolder($accessToken, 'monitoring', $parentFolderId);
            $paperFileFolderId = $this->getOrCreateFolder($accessToken, 'paper_files', $monitoringFolderId);

            $file = $request->file('paper_file');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$paperFileFolderId],
            ];

            $upload = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($upload->successful()) {
                $newFileId = $upload->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$newFileId}", [
                    'name' => "{$newFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$newFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                if ($oldFileId && $oldFileId !== $newFileId) {
                    Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$oldFileId}");
                }
            }
        }

        $journal->query()->update([
            'submission' => $data['submission'],
            'institution' => $data['institution'],
            'paper_type' => $data['paper_type'],
            'paper_file' => $newFileId,
            'date_accomplished' => Carbon::parse($data['date_accomplished'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'status_whole_paper' => $data['status_whole_paper'],
            'urgency' => $data['urgency'],
            'processing_status' => $data['processing_status'],
            'date_published' => Carbon::parse($data['date_published'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'doi' => $data['doi'],
        ]);
    }

    public function monitoringBook(Request $request)
    {
        $search = $request->input('search');

        $books = BookMonitoring::query()->when($search, function ($query, $search) {
            $query->where('book_title', 'like', "%{$search}%");
        })
            ->paginate(10);

        return Inertia::render('web/admin/monitoring/book', [
            'search' => $search,
            'books' => $books
        ]);
    }

    public function addMonitoringBook(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'book_title' => ['required'],
            'chapter' => ['required'],
            'chapter_title' => ['required'],
            'author' => ['required'],
            'deadline' => ['required'],
            'chapter_file' => ['required', 'mimes:pdf'],
            'payment_status' => ['required'],
            'completed_book' => ['required'],
            'status' => ['required'],
            'remarks' => ['required'],
            'isbn_submission' => ['required'],
            'nlp_submission' => ['required'],
            'completed_electronic' => ['required'],
            'doi' => ['required']
        ]);

        if ($request->hasFile('chapter_file')) {
            $parentFolderId = config('services.google.folder_id');
            $monitoringFolderId = $this->getOrCreateFolder($accessToken, 'monitoring', $parentFolderId);
            $chapterFileFolderId = $this->getOrCreateFolder($accessToken, 'chapter_files', $monitoringFolderId);

            $file = $request->file('chapter_file');
            $mimeType = $file->getMimeType();

            $tempMetadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$chapterFileFolderId],
            ];

            $uploadRes = Http::withToken($accessToken)
                ->attach('metadata', json_encode($tempMetadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadRes->successful()) {
                $fileId = $uploadRes->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => "{$fileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);
            }
        }

        BookMonitoring::create([
            'book_title' => $data['book_title'],
            'chapter' => $data['chapter'],
            'chapter_title' => $data['chapter_title'],
            'author' => $data['author'],
            'deadline' => Carbon::parse($data['deadline'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'chapter_file' => $fileId,
            'payment_status' => $data['payment_status'],
            'completed_book' => $data['completed_book'],
            'status' => $data['status'],
            'remarks' => $data['remarks'],
            'isbn_submission' => $data['isbn_submission'],
            'nlp_submission' => $data['nlp_submission'],
            'completed_electronic' => $data['completed_electronic'],
            'doi' => $data['doi']
        ]);
    }

    public function updateMonitoringBook(Request $request)
    {
        $accessToken = $this->token();

        $book = BookMonitoring::findOrFail($request->input('id'));

        $data = $request->validate([
            'book_title' => ['required'],
            'chapter' => ['required'],
            'chapter_title' => ['required'],
            'author' => ['required'],
            'deadline' => ['required'],
            'payment_status' => ['required'],
            'completed_book' => ['required'],
            'status' => ['required'],
            'remarks' => ['required'],
            'isbn_submission' => ['required'],
            'nlp_submission' => ['required'],
            'completed_electronic' => ['required'],
            'doi' => ['required']
        ]);

        $oldFileId = $book->chapter_file;
        $newFileId = $oldFileId;

        if ($request->hasFile('chapter_file')) {
            $request->validate(rules: [
                'chapter_file' => ['required', 'mimes:pdf'],
            ]);

            $parentFolderId = config('services.google.folder_id');
            $monitoringFolderId = $this->getOrCreateFolder($accessToken, 'monitoring', $parentFolderId);
            $chapterFileFolderId = $this->getOrCreateFolder($accessToken, 'chapter_files', $monitoringFolderId);

            $file = $request->file('chapter_file');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_upload.pdf',
                'parents' => [$chapterFileFolderId],
            ];

            $upload = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), 'temp_upload.pdf', ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($upload->successful()) {
                $newFileId = $upload->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$newFileId}", [
                    'name' => "{$newFileId}.pdf"
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$newFileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                if ($oldFileId && $oldFileId !== $newFileId) {
                    Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$oldFileId}");
                }
            }
        }

        $book->query()->update([
            'book_title' => $data['book_title'],
            'chapter' => $data['chapter'],
            'chapter_title' => $data['chapter_title'],
            'author' => $data['author'],
            'deadline' => Carbon::parse($data['deadline'])
                ->timezone('Asia/Manila')
                ->toDateString(),
            'chapter_file' => $newFileId,
            'payment_status' => $data['payment_status'],
            'completed_book' => $data['completed_book'],
            'status' => $data['status'],
            'remarks' => $data['remarks'],
            'isbn_submission' => $data['isbn_submission'],
            'nlp_submission' => $data['nlp_submission'],
            'completed_electronic' => $data['completed_electronic'],
            'doi' => $data['doi']
        ]);
    }

    public function paymentMethod()
    {
        $payments = PaymentMethod::select('id', 'name', 'account_name', 'account_number', 'account_email', 'qr_code', 'type', 'status')->get();

        return Inertia::render('others/payment-method', [
            'payments' => $payments
        ]);
    }

    public function AddPaymentMethod(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'unique:payment_methods'],
            'account_name' => ['required'],
            'account_email' => ['unique:payment_methods'],
            'qr_code' => $request->input('have_qr') === 'yes' ? ['required', 'mimes:jpeg,jpg,png', 'max:2048'] : ['nullable'],
        ]);

        if ($request->input('have_qr') === 'yes') {
            $uploadedQrCode = Cloudinary::uploadApi()->upload(
                $request->file('qr_code')->getRealPath(),
                [
                    'folder' => 'ditads/payment_methods/qr_code'
                ]
            );

            $qr_code = $uploadedQrCode['secure_url'];
        }

        PaymentMethod::create([
            'name' => $data['name'],
            'account_name' => $data['account_name'],
            'account_number' => $data['account_number'],
            'account_email' => $data['account_email'],
            'qr_code' => $qr_code ?? null
        ]);
    }

    public function UpdatePaymentMethod(Request $request)
    {
        $payment = PaymentMethod::findOrFail($request->input('id'));

        $data = $request->validate([
            'name' => ['required', 'unique:payment_methods,name,' . $request->input('id')],
            'account_name' => ['required'],
            'account_email' => ['unique:payment_methods,account_email,' . $request->input('id')],
        ]);

        $payment->query()->update([
            'name' => $data['name'],
            'account_name' => $data['account_name'],
            'account_number' => $data['account_number'],
            'account_email' => $data['account_email'],
        ]);

        if ($request->input('have_qr') === 'yes') {
            $request->validate([
                'qr_code' => ['required']
            ]);

            if ($request->hasFile('qr_code')) {
                $request->validate([
                    'qr_code' => ['mimes:jpeg,jpg,png']
                ]);

                if ($payment->qr_code) {
                    $publicId = pathinfo(parse_url($payment->qr_code, PHP_URL_PATH), PATHINFO_FILENAME);
                    Cloudinary::uploadApi()->destroy('ditads/payment_methods/qr_code/' . $publicId);
                }

                $uploadedQrCode = Cloudinary::uploadApi()->upload(
                    $request->file('qr_code')->getRealPath(),
                    [
                        'folder' => 'ditads/payment_methods/qr_code'
                    ]
                );

                $qr_code = $uploadedQrCode['secure_url'];

                $payment->query()->update([
                    'qr_code' => $qr_code
                ]);
            }
        } else {
            if ($payment->qr_code) {
                $publicId = pathinfo(parse_url($payment->qr_code, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::uploadApi()->destroy('ditads/payment_methods/qr_code/' . $publicId);

                $payment->query()->update([
                    'qr_code' => null,
                ]);
            }
        }
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
        $data = $request->validate([
            'name' => ['required', 'unique:schools'],
        ]);

        School::create([
            'name' => $data['name'],
        ]);
    }

    public function updateSchool(Request $request)
    {
        $school = School::findOrFail($request->input('id'));

        $data = $request->validate([
            'name' => ['required', 'unique:schools,name,' . $request->input('id')],
        ]);

        $school->query()->update([
            'name' => $data['name'],
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
        $data = $request->validate([
            'name' => ['required', 'unique:book_categories'],
        ]);

        BookCategory::create([
            'name' => $data['name'],
        ]);
    }

    public function UpdateBookCategory(Request $request)
    {
        $category = BookCategory::findOrFail($request->input('id'));

        $data = $request->validate([
            'name' => ['required', 'unique:book_categories,name,' . $request->input('id')],
        ]);

        $category->query()->update([
            'name' => $data['name'],
        ]);
    }
}
