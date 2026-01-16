<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\ApplicantTraining;
use App\Models\AuthorBook;
use App\Models\BookMonitoring;
use App\Models\BookPublication;
use App\Models\CooperativeTraining;
use App\Models\CustomerBook;
use App\Models\Event;
use App\Models\JournalMonitoring;
use App\Models\Magazine;
use App\Models\ResearchJournal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class WebController extends Controller
{
    public function welcome()
    {
        return Inertia::render('web/welcome');
    }

    public function aboutUs()
    {
        return Inertia::render('web/about-us');
    }

    public function event()
    {
        $events = Event::select('title', 'content', 'image_file_id', 'date')
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('web/event', [
            'events' => $events,
        ]);
    }

    public function cooperativeTraining()
    {
        $trainings = CooperativeTraining::query()
            ->select('id', 'event_name', 'from_date', 'to_date', 'description')
            ->orderByDesc('from_date')
            ->orderByDesc('to_date')
            ->get();

        return Inertia::render('web/cooperative-training', [
            'trainings' => $trainings
        ]);
    }

    public function submitApplicant(Request $request)
    {
        $accessToken = $this->token();

        $request->validate([
            'last_name' => ['required'],
            'first_name' => ['required'],
            'email' => ['email'],
            'birth_date' => ['required'],
            'gender' => ['required'],
            'cooperative_name' => ['required'],
            'proof_payment' => ['required'],
        ]);

        if ($request->hasFile('proof_payment')) {
            $ditadsFolderId = config('services.google.folder_id');

            $proof_paymentsFolderId = $this->getOrCreateFolder($accessToken, 'proof_payments', $ditadsFolderId);

            $file = $request->file('proof_payment');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$proof_paymentsFolderId],
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

                $applicant = Applicant::create([
                    'last_name' => $request->last_name,
                    'first_name' => $request->first_name,
                    'middle_name' => $request->middle_name,
                    'email' => $request->email,
                    'birth_date' => Carbon::parse($request->birth_date)
                        ->timezone('Asia/Manila')
                        ->toDateString(),
                    'gender' => $request->gender,
                    'cooperative_name' => $request->cooperative_name
                ]);

                do {
                    $application_number = random_int(1000000000, 9999999999);
                } while (
                    ApplicantTraining::query()
                        ->where('application_number', $application_number)
                        ->exists()
                );

                ApplicantTraining::create([
                    'applicant_id' => $applicant->id,
                    'training_id' => $request->training_id,
                    'application_number' => $application_number,
                    'proof_payment' => $fileId,
                ]);
            }
        }
    }

    public function researchConsultant()
    {
        $consultants = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'consultant')
            ->orderByRaw("FIELD(position, 'Head of Research Consultant', 'Associate Research Consultant', 'Research Consultant')")
            ->get();

        return Inertia::render('web/research-consultant', [
            'consultants' => $consultants,
        ]);
    }

    public function bookPublication(Request $request)
    {
        $user = $request->user();
        $bookIds = collect();

        if ($user?->role === 'author') {
            $bookIds = AuthorBook::where('author_id', $user->id)
                ->pluck('book_publication_id');
        } elseif ($user?->role === 'customer') {
            $bookIds = CustomerBook::where('customer_id', $user->id)
                ->pluck(column: 'book_publication_id');
        }

        $search = $request->input('search');

        $booksQuery = BookPublication::select(
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
            'soft_price',
            'pdf_file',
            'cover_file_id',
            'open_access'
        );

        $covers = (clone $booksQuery)->select('cover_file_id', 'cover_page')->get();

        if ($search) {
            $booksQuery->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('soft_isbn', 'like', "%{$search}%")
                    ->orWhere('hard_isbn', 'like', "%{$search}%");
            });
        }

        $books = $booksQuery
            ->orderBy('published_at', 'desc')
            ->paginate(100)
            ->through(function ($book) use ($bookIds) {
                $book->has_access = $bookIds->contains($book->id);

                return $book;
            })
            ->withQueryString();

        return Inertia::render('web/book/book-publication', [
            'books' => $books,
            'covers' => $covers,
            'search' => $search,
        ]);
    }

    public function generateBookHash($soft_isbn, $hard_isbn)
    {
        $secret = config('app.key');

        return hash_hmac('sha256', $soft_isbn . '|' . $hard_isbn, $secret);
    }

    public function viewFlipBook(Request $request, $hash)
    {
        $book = BookPublication::get()->first(function ($book) use ($hash) {
            $generated = $this->generateBookHash($book->soft_isbn, $book->hard_isbn);

            return hash_equals($generated, $hash);
        });

        if (!$book) {
            abort(404);
        }

        $isOpenAccess = $book->open_access == 1;

        if (!$isOpenAccess) {
            $user = $request->user();

            if (!$user) {
                abort(401);
            }

            if ($user->role !== 'admin') {
                $hasAccess = AuthorBook::where('author_id', $user->id)
                    ->where('book_publication_id', $book->id)
                    ->exists();

                if (!$hasAccess) {
                    abort(403, 'Unauthorized access to this book');
                }
            }
        }

        return Inertia::render('web/book/view-book', [
            'book' => $book->pdf_file,
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
            'magazine' => $magazine->pdf_file,
        ]);
    }

    public function magazine(Request $request)
    {
        $volume = $request->query('volume');
        $issue = $request->query('issue');

        if (!$volume || !$issue) {
            $latest = Magazine::orderByDesc('published_at')->first();

            if ($latest) {
                $volume = $latest->volume;

                $month = date('n', strtotime($latest->published_at));

                if ($month >= 4 && $month <= 6) {
                    $issue = 1;
                } elseif ($month >= 7 && $month <= 9) {
                    $issue = 2;
                } elseif ($month >= 10 && $month <= 12) {
                    $issue = 3;
                } else {
                    $issue = 4;
                }
            }
        }

        $editors = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->orderByRaw("FIELD(position, 'Editor in Chief', 'Associate Editor', 'Editorial Board')")
            ->get();

        $magazines = Magazine::select('cover_page', 'volume', 'issue', 'pdf_file', 'published_at', 'cover_file_id')
            ->where('volume', $volume)
            ->where('issue', $issue)
            ->latest('published_at')
            ->get();

        $archives = Magazine::select('volume', 'issue', 'published_at')
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

                if ($month >= 4 && $month <= 6) {
                    $range = 'April - June';
                } elseif ($month >= 7 && $month <= 9) {
                    $range = 'July - September';
                } elseif ($month >= 10 && $month <= 12) {
                    $range = 'October - December';
                } else {
                    $range = 'January - March';
                    $year += 1;
                }

                return [
                    'volume' => $first->volume,
                    'issue' => $first->issue,
                    'label' => "Volume {$first->volume}, Issue {$first->issue} ({$range} {$year})",
                ];
            })->values();

        return Inertia::render('web/magazine/layout', [
            'editors' => $editors,
            'magazines' => $magazines,
            'archives' => $archives,
            'activeVolume' => $volume,
            'activeIssue' => $issue,
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
            'doi',
            'type'
        )
            ->where('type', 'imrj')
            ->where('volume', $volume)
            ->where('issue', $issue)
            ->latest('published_at')
            ->get();

        $archives = ResearchJournal::select('volume', 'issue', 'published_at', 'type')
            ->where('type', 'imrj')
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
                    1 => 'January - March',
                    2 => 'April - June',
                    3 => 'July - September',
                    4 => 'October - December',
                };

                return [
                    'volume' => $first->volume,
                    'issue' => $first->issue,
                    'label' => "Volume {$first->volume}, Issue {$first->issue} ({$range} {$year})",
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

    public function viewJournalIMRJ($id)
    {
        $journal = ResearchJournal::select(
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
            'doi',
            'type'
        )
            ->findOrFail($id);

        return Inertia::render('web/imrj-journal/view-journal', [
            'journal' => $journal,
        ])->withViewData([
                    'journal' => $journal,
                ]);
    }

    public function JEBMPA(Request $request)
    {
        $volume = $request->query('volume');
        $issue = $request->query('issue');

        if (!$volume || !$issue) {
            $latest = ResearchJournal::orderByDesc('published_at')->first();

            if ($latest) {
                $volume = $latest->volume;

                $month = date('n', strtotime($latest->published_at));

                if ($month >= 4 && $month <= 6) {
                    $issue = 1;
                } elseif ($month >= 7 && $month <= 9) {
                    $issue = 2;
                } elseif ($month >= 10 && $month <= 12) {
                    $issue = 3;
                } else {
                    $issue = 4;
                }
            }
        }

        $editors = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->orderByRaw("FIELD(position, 'Editor in Chief', 'Associate Editor', 'Editorial Board')")
            ->get();

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
            'doi',
            'type'
        )
            ->where('type', 'jebmpa')
            ->where('volume', $volume)
            ->where('issue', $issue)
            ->latest('published_at')
            ->get();

        $archives = ResearchJournal::select('volume', 'issue', 'published_at', 'type')
            ->where('type', 'jebmpa')
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

                if ($month >= 4 && $month <= 6) {
                    $range = 'April - June';
                } elseif ($month >= 7 && $month <= 9) {
                    $range = 'July - September';
                } elseif ($month >= 10 && $month <= 12) {
                    $range = 'October - December';
                } else {
                    $range = 'January - March';
                    $year += 1;
                }

                return [
                    'volume' => $first->volume,
                    'issue' => $first->issue,
                    'label' => "Volume {$first->volume}, Issue {$first->issue} ({$range} {$year})",
                ];
            })->values();

        return Inertia::render('web/jebmpa-journal/layout', [
            'editors' => $editors,
            'journals' => $journals,
            'archives' => $archives,
            'activeVolume' => $volume,
            'activeIssue' => $issue,
        ]);
    }

    public function viewJournalJEBMPA($id)
    {
        $journal = ResearchJournal::select(
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
            'doi',
            'type'
        )
            ->findOrFail($id);

        return Inertia::render('web/jebmpa-journal/view-journal', [
            'journal' => $journal,
        ])->withViewData([
                    'journal' => $journal,
                ]);
    }

    public function viewIMRJ($path)
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

    public function viewJEBMPA($path)
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

    public function viewBook(Request $request, $path)
    {
        $user = $request->user();

        $openAccess = BookPublication::where('pdf_file', $path)
            ->where('open_access', 1)
            ->exists();

        if ($openAccess) {
            return $this->servePdf($path);
        }

        if (!$user) {
            abort(401);
        }

        if ($user->role !== 'admin') {
            $hasAccess = AuthorBook::where('author_id', $user->id)
                ->whereHas(
                    'book_publication',
                    function ($query) use ($path) {
                        $query->where('pdf_file', $path);
                    }
                )
                ->exists();

            if (!$hasAccess) {
                abort(403, 'Unauthorized access to this book');
            }
        }

        return $this->servePdf($path);
    }

    private function servePdf($path)
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

    public function monitoringJournal(Request $request)
    {
        $search = $request->input('search');

        $journals = JournalMonitoring::when($search, function ($query, $search) {
            $query->where('submission', 'like', "%{$search}%");
        })
            ->paginate(10);

        return Inertia::render('web/monitoring/journal', [
            'search' => $search,
            'journals' => $journals
        ]);
    }

    public function monitoringBook(Request $request)
    {
        $search = $request->input('search');

        $books = BookMonitoring::when($search, function ($query, $search) {
            $query->where('book_title', 'like', "%{$search}%");
        })
            ->paginate(10);

        return Inertia::render('web/monitoring/book', [
            'search' => $search,
            'books' => $books
        ]);
    }

    public function contactUs()
    {
        return Inertia::render('web/contact-us');
    }

    public function viewPdf($path)
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
}
