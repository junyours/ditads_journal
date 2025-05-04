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
        Schema::create('book_publications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('isbn');
            $table->string('cover_page');
            $table->string('author');
            $table->string('overview');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_publications');
    }
};
