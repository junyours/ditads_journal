<?php

namespace App\Http\Controllers;

use App\Models\AuthorBook;
use App\Models\BookPublication;
use App\Models\CustomerBook;
use App\Models\Magazine;
use App\Models\ResearchJournal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class WebController extends Controller
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

    public function welcome()
    {
        return Inertia::render('web/welcome');
    }

    public function aboutUs()
    {
        return Inertia::render('web/about-us');
    }

    public function researchConsultant()
    {
        $consultants = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'consultant')
            ->orderByRaw("FIELD(position, 'Head of Research Consultant', 'Associate Research Consultant', 'Research Consultant')")
            ->get();

        return Inertia::render('web/research-consultant', [
            'consultants' => $consultants
        ]);
    }

    public function bookPublication(Request $request)
    {
        $user = $request->user();
        $bookIds = collect();

        if ($user?->role === 'author') {
            $bookIds = AuthorBook::where('author_id', $user->id)
                ->pluck('book_publication_id');
        } else if ($user?->role === 'customer') {
            $bookIds = CustomerBook::where('customer_id', $user->id)
                ->pluck(column: 'book_publication_id');
        }

        $books = BookPublication::select(
            'id',
            'title',
            'soft_isbn',
            'hard_isbn',
            'cover_page',
            'author',
            'overview',
            'published_at',
            'doi',
            'overview_pdf_file',
            'hard_price',
            'soft_price'
        )->get()->map(function ($book) use ($bookIds) {
            $book->has_access = $bookIds->contains($book->id);
            return $book;
        });

        return Inertia::render('web/book/book-publication', [
            'books' => $books
        ]);
    }

    public function generateBookHash($soft_isbn, $hard_isbn)
    {
        $secret = config('app.key');
        return hash_hmac('sha256', $soft_isbn . '|' . $hard_isbn, $secret);
    }

    public function viewFlipBook(Request $request, $hash)
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        $book = BookPublication::get()->first(function ($book) use ($hash) {
            $generated = $this->generateBookHash($book->soft_isbn, $book->hard_isbn);
            return hash_equals($generated, $hash);
        });

        if (!$book) {
            abort(404);
        }

        if ($user->role !== 'admin') {
            $hasAccess = AuthorBook::where('author_id', $user->id)
                ->where('book_publication_id', $book->id)
                ->exists();

            if (!$hasAccess) {
                abort(403, 'Unauthorized access to this book');
            }
        }

        return Inertia::render('web/book/view-book', [
            'book' => $book->pdf_file
        ]);
    }

    public function generateMagazineHash($cover_file_id)
    {
        $secret = config('app.key');
        return hash_hmac('sha256', $cover_file_id, $secret);
    }

    public function viewFlipMagazine($hash)
    {
        $magazine = Magazine::get()->first(function ($magazine) use ($hash) {
            $generated = $this->generateMagazineHash($magazine->cover_file_id);
            return hash_equals($generated, $hash);
        });

        if (!$magazine) {
            abort(404);
        }

        return Inertia::render('web/magazine/view-magazine', [
            'magazine' => $magazine->pdf_file
        ]);
    }

    public function magazine()
    {
        $editors = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->orderByRaw("FIELD(position, 'Editor in Chief', 'Associate Editor', 'Editorial Board')")
            ->get();

        $magazines = Magazine::select('cover_page', 'volume', 'issue', 'pdf_file', 'published_at', 'cover_file_id')
            ->get();

        return Inertia::render('web/magazine/layout', [
            'editors' => $editors,
            'magazines' => $magazines
        ]);
    }

    public function IMRJ(Request $request)
    {
        $volume = $request->query('volume');
        $issue = $request->query('issue');

        if (!$volume || !$issue) {
            $latest = ResearchJournal::select('volume', 'issue')
                ->orderByDesc('volume')
                ->orderByDesc('issue')
                ->first();

            if ($latest) {
                $volume = $latest->volume;
                $issue = $latest->issue;
            }
        }

        $editors = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->orderByRaw("FIELD(position, 'Editor in Chief', 'Associate Editor', 'Editorial Board')")
            ->get();

        $journals = ResearchJournal::select(
            'volume',
            'issue',
            'title',
            'author',
            'abstract',
            'pdf_file',
            'published_at',
            'country',
            'page_number',
            'doi'
        )
            ->where('volume', $volume)
            ->where('issue', $issue)
            ->latest('published_at')
            ->get();

        $archives = ResearchJournal::select('volume', 'issue', 'published_at')
            ->orderByDesc('volume')
            ->orderByDesc('issue')
            ->distinct()
            ->get()
            ->groupBy(function ($item) {
                return "Volume {$item->volume}, Issue {$item->issue}";
            })->map(function ($group) {
                $first = $group->first();
                $month = date('n', strtotime($first->published_at));
                $year = date('Y', strtotime($first->published_at));
                $range = match ((int) ceil($month / 3)) {
                    1 => "January - March",
                    2 => "April - June",
                    3 => "July - September",
                    4 => "October - December",
                };
                return [
                    'volume' => $first->volume,
                    'issue' => $first->issue,
                    'label' => "Volume {$first->volume}, Issue {$first->issue} ({$range} {$year})"
                ];
            })->values();

        return Inertia::render('web/imrj-journal/layout', [
            'editors' => $editors,
            'journals' => $journals,
            'archives' => $archives,
            'activeVolume' => $volume,
            'activeIssue' => $issue,
        ]);
    }

    public function JEPMPA()
    {
        $editors = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->orderByRaw("FIELD(position, 'Editor in Chief', 'Associate Editor', 'Editorial Board')")
            ->get();

        return Inertia::render('web/jepmpa-journal/layout', [
            'editors' => $editors,
        ]);
    }

    public function viewJournal($path)
    {
        $accessToken = $this->token();

        $cloudinaryResponse = Http::get("https://res.cloudinary.com/dzzyp9crw/raw/upload/{$path}");

        if ($cloudinaryResponse->ok()) {
            return response($cloudinaryResponse->body(), 200, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        $googleDriveResponse = Http::withToken($accessToken)->get("https://www.googleapis.com/drive/v3/files/{$path}", [
            'alt' => 'media',
        ]);

        if ($googleDriveResponse->ok()) {
            return response($googleDriveResponse->body(), 200, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        abort(404);
    }

    public function viewBook($path)
    {
        $accessToken = $this->token();

        $cloudinaryResponse = Http::get("https://res.cloudinary.com/dzzyp9crw/raw/upload/{$path}");

        if ($cloudinaryResponse->ok()) {
            return response($cloudinaryResponse->body(), 200, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        $googleDriveResponse = Http::withToken($accessToken)->get("https://www.googleapis.com/drive/v3/files/{$path}", [
            'alt' => 'media',
        ]);

        if ($googleDriveResponse->ok()) {
            return response($googleDriveResponse->body(), 200, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        abort(404);
    }

    public function viewMagazine($path)
    {
        $accessToken = $this->token();

        $googleDriveResponse = Http::withToken($accessToken)->get("https://www.googleapis.com/drive/v3/files/{$path}", [
            'alt' => 'media',
        ]);

        if ($googleDriveResponse->ok()) {
            return response($googleDriveResponse->body(), 200, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        abort(404);
    }

    public function contactUs()
    {
        return Inertia::render('web/contact-us');
    }
}
