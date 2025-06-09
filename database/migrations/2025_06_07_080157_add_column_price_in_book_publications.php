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
            $table->decimal('hard_price')->nullable();
            $table->decimal('soft_price')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_publications', function (Blueprint $table) {
            $table->dropColumn('hard_price');
            $table->dropColumn('soft_price');
        });
    }
};
