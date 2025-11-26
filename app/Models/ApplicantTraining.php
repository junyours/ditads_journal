<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicantTraining extends Model
{
    protected $table = 'applicant_trainings';

    protected $fillable = [
        'applicant_id',
        'training_id',
        'application_number',
        'proof_payment',
        'status'
    ];

    public function applicant()
    {
        return $this->belongsTo(Applicant::class, 'applicant_id');
    }

    public function cooperative_training()
    {
        return $this->belongsTo(CooperativeTraining::class, 'training_id');
    }
}
