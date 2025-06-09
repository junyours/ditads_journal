<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookTransaction extends Model
{
    protected $table = 'book_transactions';

    protected $fillable = [
        'book_publication_id',
        'payment_method_id',
        'amount',
        'type',
        'reference_number',
        'receipt_image',
        'delivery_form',
        'status'
    ];
}
