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
        Schema::create('research_journals', function (Blueprint $table) {
            $table->id();
            $table->string('volume');
            $table->string('issue');
            $table->string('title');
            $table->longText('author');
            $table->string('country');
            $table->string('page_number');
            $table->longText('abstract');
            $table->string('pdf_file');
            $table->date('published_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_journals');
    }
};
