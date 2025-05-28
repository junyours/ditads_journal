<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookPublication extends Model
{
    protected $table = 'book_publications';

    protected $fillable = [
        'book_category_id',
        'title',
        'soft_isbn',
        'hard_isbn',
        'cover_page',
        'author',
        'overview',
        'published_at',
        'pdf_file',
        'doi'
    ];
}
