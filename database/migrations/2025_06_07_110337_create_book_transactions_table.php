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
        Schema::create('book_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_publication_id')->constrained('book_publications');
            $table->foreignId('payment_method_id')->constrained('payment_methods');
            $table->decimal('amount');
            $table->string('type');
            $table->string('reference_number');
            $table->string('receipt_image');
            $table->string('delivery_form')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_transactions');
    }
};
