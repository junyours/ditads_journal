<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('journal_monitorings', function (Blueprint $table) {
            $table->id();
            $table->string('submission');
            $table->string('institution');
            $table->string('paper_type');
            $table->string('paper_file');
            $table->date('date_accomplished');
            $table->string('status_whole_paper');
            $table->string('urgency');
            $table->string('processing_status');
            $table->date('date_published');
            $table->string('doi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_monitorings');
    }
};
