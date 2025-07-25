<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_todos_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('todos')
            ->has('todos')
        );
    }

    public function test_can_create_todo(): void
    {
        $todoData = [
            'title' => 'Test Todo',
            'description' => 'Test Description',
        ];

        $response = $this->post('/todos', $todoData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'title' => 'Test Todo',
            'description' => 'Test Description',
            'completed' => false,
        ]);
    }

    public function test_can_create_todo_without_description(): void
    {
        $todoData = [
            'title' => 'Test Todo',
        ];

        $response = $this->post('/todos', $todoData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'title' => 'Test Todo',
            'description' => null,
            'completed' => false,
        ]);
    }

    public function test_cannot_create_todo_without_title(): void
    {
        $todoData = [
            'description' => 'Test Description',
        ];

        $response = $this->post('/todos', $todoData);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['title']);
    }

    public function test_can_toggle_todo_completion(): void
    {
        $todo = Todo::factory()->create(['completed' => false]);

        $response = $this->patch("/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'completed' => true,
        ]);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->delete("/todos/{$todo->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('todos', [
            'id' => $todo->id,
        ]);
    }

    public function test_todos_are_displayed_in_correct_order(): void
    {
        $oldTodo = Todo::factory()->create(['created_at' => now()->subHour()]);
        $newTodo = Todo::factory()->create(['created_at' => now()]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('todos')
            ->has('todos', 2)
            ->where('todos.0.id', $newTodo->id)
            ->where('todos.1.id', $oldTodo->id)
        );
    }

    public function test_validation_rules_for_todo_creation(): void
    {
        // Test max length for title
        $response = $this->post('/todos', [
            'title' => str_repeat('a', 256),
        ]);
        $response->assertSessionHasErrors(['title']);

        // Test max length for description
        $response = $this->post('/todos', [
            'title' => 'Valid title',
            'description' => str_repeat('a', 1001),
        ]);
        $response->assertSessionHasErrors(['description']);
    }
}