<?php

use App\Enums\SnagStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('snags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->string('trade');
            $table->string('severity');
            $table->string('status')->default(SnagStatus::Open->value);
            $table->string('photo_path')->nullable();
            $table->string('assigned_to')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
            $table->index(['project_id', 'severity']);
            $table->index(['project_id', 'trade']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('snags');
    }
};
