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
        Schema::table('book_publications', function (Blueprint $table) {
            $table->foreignId('book_category_id')->nullable()->constrained('book_categories');
            $table->renameColumn('isbn', 'soft_isbn');
            $table->string('hard_isbn')->nullable();
            $table->string('pdf_file')->nullable();
            $table->date('published_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_publications', function (Blueprint $table) {
            $table->dropForeign(['book_category_id']);
            $table->dropColumn('book_category_id');
            $table->renameColumn('soft_isbn', 'isbn');
            $table->dropColumn('hard_isbn');
            $table->dropColumn('pdf_file');
            $table->dropColumn('published_at');
        });
    }
};
