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

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
