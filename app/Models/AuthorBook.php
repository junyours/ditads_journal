<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthorBook extends Model
{
    protected $table = 'author_books';

    protected $fillable = [
        'author_id',
        'book_publication_id'
    ];

    public function book_publication()
    {
        return $this->BelongsTo(BookPublication::class, 'book_publication_id');
    }
}
