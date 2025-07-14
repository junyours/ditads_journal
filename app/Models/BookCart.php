<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookCart extends Model
{
    protected $table = 'book_carts';

    protected $fillable = [
        'customer_id',
        'book_publication_id',
        'quantity'
    ];

    public function book_publication()
    {
        return $this->belongsTo(BookPublication::class, 'book_publication_id');
    }
}
