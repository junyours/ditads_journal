<?php

namespace App\Http\Controllers;

use App\Models\BookPublication;
use App\Models\Magazine;
use App\Models\ResearchJournal;
use App\Models\User;
use Illuminate\Http\Request;
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

    public function bookPublication()
    {
        $books = BookPublication::select('title', 'isbn', 'cover_page', 'author', 'overview', 'created_at')
            ->get();

        return Inertia::render('web/book-publication', [
            'books' => $books
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

    public function researchJournal()
    {
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
            'created_at'
        )
            ->get();

        return Inertia::render('web/journal/layout', [
            'editors' => $editors,
            'journals' => $journals
        ]);
    }

    public function contactUs()
    {
        return Inertia::render('web/contact-us');
    }
}
