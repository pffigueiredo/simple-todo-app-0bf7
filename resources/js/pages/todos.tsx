import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    todos: Todo[];
    [key: string]: unknown;
}

export default function Todos({ todos }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        router.post(route('todos.store'), 
            { 
                title: title.trim(), 
                description: description.trim() || null 
            }, 
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setTitle('');
                    setDescription('');
                },
                onFinish: () => setIsSubmitting(false)
            }
        );
    };

    const toggleComplete = (todo: Todo) => {
        router.patch(route('todos.update', todo.id), 
            { completed: !todo.completed }, 
            {
                preserveState: true,
                preserveScroll: true
            }
        );
    };

    const deleteTodo = (todo: Todo) => {
        if (confirm('Are you sure you want to delete this todo?')) {
            router.delete(route('todos.destroy', todo.id), {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    return (
        <>
            <Head title="Todo App" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
                        <p className="text-lg text-gray-600">Stay organized and get things done</p>
                    </div>

                    {/* Add Todo Form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Todo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="What needs to be done?"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="text-lg"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <Textarea
                                        placeholder="Add a description (optional)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={!title.trim() || isSubmitting}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {isSubmitting ? 'Adding...' : 'Add Todo'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
                                <p className="text-sm text-gray-600">Total Tasks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-orange-600">{pendingTodos.length}</div>
                                <p className="text-sm text-gray-600">Pending</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
                                <p className="text-sm text-gray-600">Completed</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Todo Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pending Todos */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Circle className="h-6 w-6 text-orange-500" />
                                Pending ({pendingTodos.length})
                            </h2>
                            <div className="space-y-3">
                                {pendingTodos.length === 0 ? (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <p className="text-gray-500 text-center">No pending todos. Great job!</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    pendingTodos.map((todo) => (
                                        <Card key={todo.id} className="border-l-4 border-l-orange-500">
                                            <CardContent className="pt-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <Checkbox
                                                            checked={todo.completed}
                                                            onCheckedChange={() => toggleComplete(todo)}
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900">{todo.title}</h3>
                                                            {todo.description && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {todo.description}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                Created {new Date(todo.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteTodo(todo)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Completed Todos */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                Completed ({completedTodos.length})
                            </h2>
                            <div className="space-y-3">
                                {completedTodos.length === 0 ? (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <p className="text-gray-500 text-center">No completed todos yet.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    completedTodos.map((todo) => (
                                        <Card key={todo.id} className="border-l-4 border-l-green-500 opacity-75">
                                            <CardContent className="pt-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <Checkbox
                                                            checked={todo.completed}
                                                            onCheckedChange={() => toggleComplete(todo)}
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900 line-through">
                                                                {todo.title}
                                                            </h3>
                                                            {todo.description && (
                                                                <p className="text-sm text-gray-600 mt-1 line-through">
                                                                    {todo.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                                    Completed
                                                                </Badge>
                                                                <p className="text-xs text-gray-400">
                                                                    {new Date(todo.updated_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteTodo(todo)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {todos.length === 0 && (
                        <Card className="mt-8">
                            <CardContent className="pt-8 pb-8">
                                <div className="text-center">
                                    <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No todos yet</h3>
                                    <p className="text-gray-500">Create your first todo item to get started!</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}