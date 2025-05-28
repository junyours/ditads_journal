<?php

namespace App\Http\Controllers;

use App\Models\BookPublication;
use App\Models\Magazine;
use App\Models\ResearchJournal;
use App\Models\User;
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

    public function researchConsultant()
    {
        $consultants = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'consultant')
            ->get();

        return Inertia::render('web/research-consultant', [
            'consultants' => $consultants
        ]);
    }

    public function bookPublication()
    {
        $books = BookPublication::select('id', 'title', 'soft_isbn', 'hard_isbn', 'cover_page', 'author', 'overview', 'published_at', 'doi')
            ->get();

        return Inertia::render('web/book/book-publication', [
            'books' => $books
        ]);
    }

    public function viewFlipBook(Request $request)
    {
        $book = BookPublication::findOrFail($request->id);

        return Inertia::render('web/book/view-book', [
            'book' => $book->pdf_file
        ]);
    }

    public function magazine()
    {
        $editors = User::select('name', 'position', 'email', 'department', 'avatar')
            ->where('role', 'editor')
            ->get();

        $magazines = Magazine::select('cover_page', 'volume', 'issue')
            ->get();

        return Inertia::render('web/magazine/layout', [
            'editors' => $editors,
            'magazines' => $magazines
        ]);
    }

    public function researchJournal(Request $request)
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

        return Inertia::render('web/journal/layout', [
            'editors' => $editors,
            'journals' => $journals,
            'archives' => $archives,
            'activeVolume' => $volume,
            'activeIssue' => $issue,
        ]);
    }

    public function viewJournal($path)
    {
        $cloudinaryUrl = 'https://res.cloudinary.com/dzzyp9crw/raw/upload/' . $path;
        $response = Http::get($cloudinaryUrl);

        if ($response->ok()) {
            return response($response->body(), 200, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        abort(404);
    }

    public function viewBook($path)
    {
        $cloudinaryUrl = 'https://res.cloudinary.com/dzzyp9crw/raw/upload/' . $path;
        $response = Http::get($cloudinaryUrl);

        if ($response->ok()) {
            return response($response->body(), 200, [
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
