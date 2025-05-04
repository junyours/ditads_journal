<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Magazine extends Model
{
    protected $table = 'magazines';

    protected $fillable = [
        'cover_page',
        'pdf_file',
        'volume',
        'issue',
    ];
}
