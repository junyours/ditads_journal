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
        'country',
        'page_number',
        'abstract',
        'pdf_file',
        'published_at'
    ];
}
