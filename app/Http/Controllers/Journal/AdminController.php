<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\AssignEditor;
use App\Models\JournalFile;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminController extends Controller
{
  public function getRequest()
  {
    $journals = \App\Models\Request::with(['user', 'school', 'journal_file', 'co_author'])
      ->latest()
      ->get();

    $editors = User::where('role', 'editor')->get();

    return Inertia::render('journal/admin/request', [
      'journals' => $journals,
      'editors' => $editors
    ]);
  }

  public function acceptRequest(Request $request)
  {
    if ($request->selected === 1) {
      $request->validate([
        'editor_id' => ['required']
      ], [
        'editor_id.required' => 'The editor field is required.',
      ]);

      AssignEditor::create([
        'request_id' => $request->request_id,
        'user_id' => $request->editor_id
      ]);
    } else {
      AssignEditor::create([
        'request_id' => $request->request_id,
        'user_id' => $request->user()->id,
      ]);
    }

    \App\Models\Request::where('id', $request->request_id)
      ->update([
        'status' => 'accepted'
      ]);

    JournalFile::where('id', $request->request_id)
      ->update([
        'status' => 'editing'
      ]);
  }

  public function assignDocumentMe(Request $request)
  {
    $journals = AssignEditor::where('user_id', $request->user()->id)
      ->with(['request.journal_file', 'request.user'])
      ->latest()
      ->get();

    return Inertia::render('journal/admin/assign-documents/me', [
      'journals' => $journals
    ]);
  }

  public function assignDocumentEditor(Request $request)
  {
    $journals = AssignEditor::whereNot('user_id', $request->user()->id)
      ->with(['request.journal_file', 'request.user'])
      ->latest()
      ->get();

    return Inertia::render('journal/admin/assign-documents/editor', [
      'journals' => $journals
    ]);
  }
}
