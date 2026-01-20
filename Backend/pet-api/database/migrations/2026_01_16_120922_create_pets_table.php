<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('species');
            $table->string('image');
            $table->text('description');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
