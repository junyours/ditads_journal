<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchJournal extends Model
{
    protected $table = 'research_journals';

    protected $fillable = [
        'volume',
        'issue',
        'title',
        'author',
        'abstract',
        'pdf_file'
    ];
}
