<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\AssignEditor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EditorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('journal/editor/dashboard');
    }

    public function assignDocument(Request $request)
    {
        $journals = AssignEditor::where('user_id', $request->user()->id)
            ->with(['request.journal_file', 'user'])
            ->latest()
            ->get();

        return Inertia::render('journal/editor/assign-document', [
            'journals' => $journals
        ]);
    }
}
