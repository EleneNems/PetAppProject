<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pet;

class PetSeeder extends Seeder
{
    public function run()
    {
        $pets = [
            [
                'name' => 'Mochi',
                'species' => 'Sheep',
                'image' => 'pets/pet10.png',
                'description' => 'Mochi is a soft little cloud who loves quiet naps and gentle head pats. Perfect for cozy days.'
            ],
            [
                'name' => 'Luna',
                'species' => 'Cat',
                'image' => 'pets/pet6.png',
                'description' => 'Luna is curious and elegant, always watching the world with bright eyes and a playful heart.'
            ],
            [
                'name' => 'Peach',
                'species' => 'Cow',
                'image' => 'pets/pet4.png',
                'description' => 'Peach is sweet and calm, bringing warm farm vibes and lots of wholesome energy.'
            ],
            [
                'name' => 'Steve',
                'species' => 'Raccoon',
                'image' => 'pets/pet7.png',
                'description' => 'Steve is a mischievous little genius who loves shiny things and midnight adventures.'
            ],
            [
                'name' => 'Daisy',
                'species' => 'Cow',
                'image' => 'pets/pet8.png',
                'description' => 'Daisy is gentle and loving, always ready to brighten your day with her soft moo.'
            ],
            [
                'name' => 'Charlie',
                'species' => 'Ferret',
                'image' => 'pets/pet2.png',
                'description' => 'Charlie is pure chaos in the cutest form — fast, playful, and endlessly entertaining.'
            ],
            [
                'name' => 'Minnie',
                'species' => 'Chipmunk',
                'image' => 'pets/pet3.png',
                'description' => 'Minnie is tiny but brave, collecting snacks and secrets wherever she goes.'
            ],
            [
                'name' => 'Pebble',
                'species' => 'Rat',
                'image' => 'pets/pet5.png',
                'description' => 'Pebble is clever and loyal, always curious and surprisingly affectionate.'
            ],
            [
                'name' => 'Bean',
                'species' => 'Bear',
                'image' => 'pets/pet9.png',
                'description' => 'Bean is a gentle giant who loves hugs, honey, and slow peaceful walks.'
            ],
        ];


        foreach ($pets as $pet) {
            Pet::create($pet);
        }
    }
}
