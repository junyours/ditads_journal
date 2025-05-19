<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignEditor extends Model
{
    protected $table = 'assign_editors';

    protected $fillable = [
        'request_id',
        'user_id'
    ];
}
