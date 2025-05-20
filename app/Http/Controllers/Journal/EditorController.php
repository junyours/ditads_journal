<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EditorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('journal/editor/dashboard');
    }

    public function assignDocument()
    {
        return Inertia::render('journal/editor/assign-document');
    }
}
