<?php

namespace App\Http\Controllers;

use App\Models\AuthorBook;
use App\Models\BookCategory;
use App\Models\BookPublication;
use App\Models\Magazine;
use App\Models\PaymentMethod;
use App\Models\ResearchJournal;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Hash;
use Http;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    private function token()
    {
        $client_id = config('services.google.client_id');
        $client_secret = config('services.google.client_secret');
        $refresh_token = config('services.google.refresh_token');

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'refresh_token' => $refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to get Google access token: ' . $response->body());
        }

        return $response->json()['access_token'];
    }

    private function getOrCreateFolder($accessToken, $folderName, $parentId)
    {
        $response = Http::withToken($accessToken)->get('https://www.googleapis.com/drive/v3/files', [
            'q' => "name='{$folderName}' and '{$parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false",
            'fields' => 'files(id)',
        ]);

        if ($response->successful() && count($response['files']) > 0) {
            return $response['files'][0]['id'];
        }

        $create = Http::withToken($accessToken)->post('https://www.googleapis.com/drive/v3/files', [
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [$parentId],
        ]);

        return $create->json()['id'];
    }

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
        $accessToken = $this->token();

        $request->validate([
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
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make('P@ssw0rd'),
            'is_default' => 1,
            'role' => 'editor',
            'position' => $request->position,
            'department' => $request->department,
            'avatar' => $avatarUrl ?? null,
            'file_id' => $fileId ?? null,
        ]);
    }

    public function updateEditor(Request $request)
    {
        $editor = User::findOrFail($request->id);
        $accessToken = $this->token();

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
            'department' => $request->department,
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

                $editor->update([
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

        $request->validate([
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
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make('P@ssw0rd'),
            'is_default' => 1,
            'role' => 'consultant',
            'position' => $request->position,
            'department' => $request->department,
            'avatar' => $avatarUrl ?? null,
            'file_id' => $fileId ?? null
        ]);
    }

    public function updateConsultant(Request $request)
    {
        $consultant = User::findOrFail($request->id);
        $accessToken = $this->token();

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

                $consultant->update([
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

        $request->validate([
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
            'name' => $request->name,
            'email' => $request->email,
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
        $author = User::findOrFail($request->id);
        $accessToken = $this->token();

        $request->validate([
            'email' => ['required', 'email', 'unique:users,email,' . $request->id],
            'name' => ['required']
        ]);

        $author->update([
            'name' => $request->name,
            'email' => $request->email,
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

                $author->update([
                    'avatar' => $avatarUrl,
                    'file_id' => $fileId
                ]);
            }
        }
    }

    public function getBookPublication()
    {
        $books = BookPublication::select('id', 'title', 'soft_isbn', 'hard_isbn', 'cover_page', 'author', 'overview', 'published_at', 'pdf_file', 'book_category_id', 'doi', 'overview_pdf_file', 'hard_price', 'soft_price')
            ->get();

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
            'books' => $books,
            'categories' => $categories,
            'authors' => $authors
        ]);
    }

    public function uploadBookPublication(Request $request)
    {
        $accessToken = $this->token();

        $request->validate([
            'title' => ['required'],
            'soft_isbn' => ['required', 'unique:book_publications'],
            'hard_isbn' => ['nullable', 'unique:book_publications'],
            'cover_page' => ['required', 'mimes:jpeg,jpg,png', 'max:3048'],
            'author' => ['required'],
            'overview' => ['required'],
            'published_at' => ['required'],
            'pdf_file' => ['required', 'mimes:pdf'],
            // 'book_category_id' => ['required'],
            // 'doi' => ['required'],
            // 'overview_pdf_file' => ['required', 'mimes:pdf'],
            'hard_price' => ['required'],
            'soft_price' => ['required'],
        ], [
            // 'book_category_id.required' => 'The book category field is required.',
            'pdf_file.required' => 'The book pdf file field is required.',
            'hard_price.required' => 'The hard bound price field is required.',
            'soft_price.required' => 'The soft bound price field is required.'
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
            'title' => $request->title,
            'soft_isbn' => $request->soft_isbn,
            'hard_isbn' => $request->hard_isbn,
            'cover_page' => $coverPageUrl,
            'cover_file_id' => $coverFileId,
            'author' => $request->author,
            'overview' => $request->overview,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
            'pdf_file' => $pdfFileId,
            // 'book_category_id' => $request->book_category_id,
            // 'doi' => $request->doi,
            // 'overview_pdf_file' => $overviewPdfFileId,
            'hard_price' => $request->hard_price,
            'soft_price' => $request->soft_price,
        ]);
    }

    public function updateBookPublication(Request $request)
    {
        $book = BookPublication::findOrFail($request->id);
        $accessToken = $this->token();

        $request->validate([
            'title' => ['required'],
            'soft_isbn' => ['required', 'unique:book_publications,soft_isbn,' . $request->id],
            'hard_isbn' => ['nullable', 'unique:book_publications,hard_isbn,' . $request->id],
            'author' => ['required'],
            'overview' => ['required'],
            'published_at' => ['required'],
            // 'book_category_id' => ['required'],
            // 'doi' => ['required'],
            'hard_price' => ['required'],
            'soft_price' => ['required'],
        ], [
            // 'book_category_id.required' => 'The book category field is required.',
            'hard_price.required' => 'The hard bound price field is required.',
            'soft_price.required' => 'The soft bound price field is required.'
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
            'hard_price' => $request->hard_price,
            'soft_price' => $request->soft_price,
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

                $book->update([
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

                $book->update([
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

                $book->update([
                    'overview_pdf_file' => $newOverviewPdfFileId,
                ]);
            }
        }
    }

    public function linkAuthorBook(Request $request)
    {
        AuthorBook::where('book_publication_id', $request->book_id)->delete();

        foreach ($request->author_id as $authorId) {
            AuthorBook::create(attributes: [
                'author_id' => $authorId,
                'book_publication_id' => $request->book_id,
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

        $request->validate([
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
            'volume' => $request->volume,
            'issue' => $request->issue,
            'pdf_file' => $fileId,
            'cover_file_id' => $coverFileId,
            'published_at' => Carbon::parse($request->published_at)
                ->timezone('Asia/Manila')
                ->toDateString(),
        ]);
    }

    public function updateMagazine(Request $request)
    {
        $magazine = Magazine::findOrFail($request->id);
        $accessToken = $this->token();

        $request->validate([
            'volume' => ['required'],
            'issue' => ['required'],
            'published_at' => ['required'],
        ]);

        $magazine->update([
            'volume' => $request->volume,
            'issue' => $request->issue,
            'published_at' => Carbon::parse($request->published_at)
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

                $magazine->update([
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

                $magazine->update([
                    'pdf_file' => $newPdfFileId,
                ]);
            }
        }
    }

    public function getIMRJ()
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

        return Inertia::render('web/admin/research-journal/imrj', [
            'journals' => $journals
        ]);
    }

    public function getJEBMPA()
    {
        return Inertia::render('web/admin/research-journal/jebmpa');
    }

    public function uploadResearchJournal(Request $request)
    {
        $accessToken = $this->token();

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
            'volume' => $request->volume,
            'issue' => $request->issue,
            'title' => $request->title,
            'author' => $request->author,
            'abstract' => $request->abstract,
            'pdf_file' => $fileId,
            'published_at' => Carbon::parse($request->published_at)->timezone('Asia/Manila')->toDateString(),
            'country' => $request->country,
            'page_number' => $request->page_number,
            'tracking_number' => $request->tracking_number,
            'doi' => $request->doi,
        ]);
    }

    public function updateResearchJournal(Request $request)
    {
        $journal = ResearchJournal::findOrFail($request->id);
        $accessToken = $this->token();

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

        $oldFileId = $journal->pdf_file;
        $newFileId = $oldFileId;

        if ($request->hasFile('pdf_file')) {
            $request->validate([
                'pdf_file' => ['mimes:pdf', 'max:2048'],
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

        $journal->update([
            'volume' => $request->volume,
            'issue' => $request->issue,
            'title' => $request->title,
            'author' => $request->author,
            'abstract' => $request->abstract,
            'published_at' => Carbon::parse($request->published_at)->timezone('Asia/Manila')->toDateString(),
            'country' => $request->country,
            'page_number' => $request->page_number,
            'pdf_file' => $newFileId,
            'tracking_number' => $request->tracking_number,
            'doi' => $request->doi,
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
        $request->validate([
            'name' => ['required', 'unique:payment_methods'],
            'account_name' => ['required'],
            'account_email' => ['unique:payment_methods'],
            'qr_code' => $request->have_qr === 'yes' ? ['required', 'mimes:jpeg,jpg,png', 'max:2048'] : ['nullable'],
        ]);

        if ($request->have_qr === 'yes') {
            $uploadedQrCode = Cloudinary::uploadApi()->upload(
                $request->file('qr_code')->getRealPath(),
                [
                    'folder' => 'ditads/payment_methods/qr_code'
                ]
            );

            $qr_code = $uploadedQrCode['secure_url'];
        }

        PaymentMethod::create([
            'name' => $request->name,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
            'account_email' => $request->account_email,
            'qr_code' => $qr_code ?? null
        ]);
    }

    public function UpdatePaymentMethod(Request $request)
    {
        $payment = PaymentMethod::findOrFail($request->id);

        $request->validate([
            'name' => ['required', 'unique:payment_methods,name,' . $request->id],
            'account_name' => ['required'],
            'account_email' => ['unique:payment_methods,account_email,' . $request->id],
        ]);

        $payment->update([
            'name' => $request->name,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
            'account_email' => $request->account_email,
        ]);

        if ($request->have_qr === 'yes') {
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

                $payment->update([
                    'qr_code' => $qr_code
                ]);
            }
        } else {
            if ($payment->qr_code) {
                $publicId = pathinfo(parse_url($payment->qr_code, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::uploadApi()->destroy('ditads/payment_methods/qr_code/' . $publicId);

                $payment->update([
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
