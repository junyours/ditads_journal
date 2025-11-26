<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CooperativeTraining extends Model
{
    protected $table = 'cooperative_trainings';

    protected $fillable = [
        'event_name',
        'from_date',
        'to_date',
        'description'
    ];

    public function applicant_training()
    {
        return $this->hasMany(ApplicantTraining::class, 'training_id');
    }
}
