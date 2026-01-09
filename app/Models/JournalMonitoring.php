<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalMonitoring extends Model
{
    protected $table = 'journal_monitorings';

    protected $fillable = [
        'submission',
        'institution',
        'paper_type',
        'paper_file',
        'date_accomplished',
        'status_whole_paper',
        'urgency',
        'processing_status',
        'date_published',
        'doi'
    ];
}
