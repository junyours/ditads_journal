<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerBook extends Model
{
    protected $table = 'customer_books';

    protected $fillable = [
        'customer_id',
        'book_publication_id'
    ];
}
