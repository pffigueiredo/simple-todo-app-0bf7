<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample todos
        Todo::factory()->create([
            'title' => 'Welcome to your Todo App!',
            'description' => 'This is a sample todo item. You can mark it as complete or delete it.',
            'completed' => false,
        ]);

        Todo::factory()->create([
            'title' => 'Learn Laravel',
            'description' => 'Master the Laravel framework for web development.',
            'completed' => false,
        ]);

        Todo::factory()->create([
            'title' => 'Build a Todo App',
            'description' => 'Create a fully functional todo application with React and Laravel.',
            'completed' => true,
        ]);

        Todo::factory()->create([
            'title' => 'Deploy to Production',
            'description' => 'Deploy the application to a production server.',
            'completed' => false,
        ]);

        // Create additional random todos
        Todo::factory(5)->create();
    }
}