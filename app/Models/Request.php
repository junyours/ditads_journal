<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $table = 'requests';

    protected $fillable = [
        'author_id',
        'school_id',
        'request_number',
        'status'
    ];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    public function journal_file()
    {
        return $this->hasMany(JournalFile::class, 'request_id');
    }

    public function co_author()
    {
        return $this->hasMany(CoAuthor::class, 'request_id');
    }
}
