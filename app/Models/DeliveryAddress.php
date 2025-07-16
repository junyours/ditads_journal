<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryAddress extends Model
{
    protected $table = 'delivery_address';

    protected $fillable = [
        'customer_id',
        'complete_address',
        'contact_number',
        'name',
        'postal_code'
    ];
}
