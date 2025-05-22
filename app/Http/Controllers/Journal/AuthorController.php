<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\CoAuthor;
use App\Models\JournalFile;
use App\Models\School;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('journal/author/dashboard');
    }

    public function getRequest(Request $request)
    {
        $schools = School::select('id', 'name')
            ->get();

        $journals = \App\Models\Request::with(['school', 'journal_file', 'co_author'])
            ->where('author_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('journal/author/request', [
            'schools' => $schools,
            'journals' => $journals
        ]);
    }

    public function generateUniqueRequestNumber()
    {
        do {
            $randomNumber = mt_rand(100000000000, 999999999999);
        } while (\App\Models\Request::where('request_number', $randomNumber)->exists());

        return $randomNumber;
    }

    public function submitJournal(Request $request)
    {
        $request->validate([
            'journal_file' => ['required', 'file'],
            'school' => ['required'],
            'co_authors.*.name' => ['required'],
            'co_authors.*.school' => ['required'],
        ], [
            'co_authors.*.name.required' => 'The co-author name field is required.',
            'co_authors.*.school.required' => 'The co-author school field is required.',
        ]);

        $req = \App\Models\Request::create([
            'author_id' => $request->user()->id,
            'school_id' => $request->school,
            'request_number' => $this->generateUniqueRequestNumber()
        ]);

        $uploadedFile = Cloudinary::uploadApi()->upload(
            $request->file('journal_file')->getRealPath(),
            [
                // 'folder' => 'ditads/journal/journal_file',
                'folder' => 'ditads/journal/test/journal_file',
                'resource_type' => 'raw',
                'format' => 'docx',
            ]
        );

        JournalFile::create([
            'request_id' => $req->id,
            'journal_file' => $uploadedFile['secure_url']
        ]);

        if ($request->filled('co_authors')) {
            foreach ($request->co_authors as $coAuthor) {
                CoAuthor::create([
                    'request_id' => $req->id,
                    'school_id' => $coAuthor['school'],
                    'name' => $coAuthor['name'],
                ]);
            }
        }
    }
}
