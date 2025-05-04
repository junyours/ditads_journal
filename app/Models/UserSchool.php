<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSchool extends Model
{
    protected $table = 'user_schools';

    protected $fillable = [
        'user_id',
        'school_id'
    ];
}
