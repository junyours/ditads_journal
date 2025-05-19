<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalFile extends Model
{
    protected $table = 'journal_files';

    protected $fillable = [
        'request_id',
        'journal_file',
        'note_file',
        'status'
    ];
}
