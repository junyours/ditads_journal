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
        Schema::create('book_monitorings', function (Blueprint $table) {
            $table->id();
            $table->string('book_title');
            $table->string('chapter');
            $table->string('chapter_title');
            $table->string('author');
            $table->date('deadline');
            $table->string('chapter_file');
            $table->string('payment_status');
            $table->string('completed_book');
            $table->string('status');
            $table->string('remarks');
            $table->string('isbn_submission');
            $table->string('nlp_submission');
            $table->string('completed_electronic');
            $table->string('doi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_monitorings');
    }
};
