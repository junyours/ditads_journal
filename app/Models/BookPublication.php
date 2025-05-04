<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookPublication extends Model
{
    protected $table = 'book_publications';

    protected $fillable = [
        'title',
        'isbn',
        'cover_page',
        'author',
        'overview'
    ];
}
