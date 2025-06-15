<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookTransaction extends Model
{
    protected $table = 'book_transactions';

    protected $fillable = [
        'customer_id',
        'book_publication_id',
        'payment_method_id',
        'amount',
        'type',
        'reference_number',
        'receipt_image',
        'delivery_address_id',
        'status',
        'quantity'
    ];

    public function book_publication()
    {
        return $this->belongsTo(BookPublication::class, 'book_publication_id');
    }
}
