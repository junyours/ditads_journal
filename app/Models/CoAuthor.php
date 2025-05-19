<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoAuthor extends Model
{
    protected $table = 'co_authors';

    protected $fillable = [
        'request_id',
        'school_id',
        'name'
    ];
}
