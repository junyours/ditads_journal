<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookMonitoring extends Model
{
    protected $table = 'book_monitorings';

    protected $fillable = [
        'book_title',
        'chapter',
        'chapter_title',
        'author',
        'deadline',
        'chapter_file',
        'payment_status',
        'completed_book',
        'status',
        'remarks',
        'isbn_submission',
        'nlp_submission',
        'completed_electronic',
        'doi'
    ];
}
