<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    protected $table = 'applicants';

    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'email',
        'birth_date',
        'gender',
        'cooperative_name'
    ];

    public function applicant_training()
    {
        return $this->hasMany(ApplicantTraining::class, 'applicant_id');
    }
}
