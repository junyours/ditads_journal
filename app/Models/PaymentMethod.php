<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $table = 'payment_methods';

    protected $fillable = [
        'name',
        'account_name',
        'account_number',
        'account_email',
        'qr_code',
        'type',
        'status'
    ];
}
