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
        Schema::table('book_transactions', function (Blueprint $table) {
            $table->dropColumn('delivery_form');
            $table->foreignId('delivery_address_id')->nullable()->constrained('delivery_address')->after('receipt_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_transactions', function (Blueprint $table) {
            $table->dropForeign(['delivery_address_id']);
            $table->dropColumn('delivery_address_id');
            $table->string('delivery_form')->nullable()->after('receipt_image');
        });
    }
};
