<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('snag_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('author');
            $table->text('body');
            $table->timestamps();

            $table->index('snag_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
