'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';

/**
 * TaskManager - Aplicação de gerenciamento de tarefas
 * 
 * Baseado no modelo de Shneiderman:
 * 1. Especificações: Definidas nas constantes e estado inicial
 * 2. Prototipagem: Implementada com componentes React
 * 3. Testes de usabilidade: Facilidade de uso com feedback visual e interação intuitiva
 */
export default function TaskManager() {
  // Estado da aplicação
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Especificações de cores e layout (conforme modelo de Shneiderman)
  const COLORS = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  };

  // Gestão de tarefas
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setError('Por favor, digite uma tarefa');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
    setError('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) {
      setError('A tarefa não pode estar vazia');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setTasks(tasks.map(task =>
      task.id === editingId ? { ...task, text: editText } : task
    ));
    setEditingId(null);
    setEditText('');
    setError('');
  };

  // Filtro de tarefas
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Efeito para acessibilidade - anúncio de erros
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Gerenciador de Tarefas
      </h1>
      
      {/* Formulário de adição - Layout e elementos de entrada definidos nas especificações */}
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Digite uma nova tarefa"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Adicionar
        </button>
      </form>
      
      {/* Feedback de erro - Componente de usabilidade */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      {/* Filtros - Sequência de ações especificada */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Concluídas
        </button>
      </div>
      
      {/* Lista de tarefas - Componente principal de interação */}
      <div className="space-y-2">
        {filteredTasks.map(task => (
          <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
            <button
              onClick={() => toggleTask(task.id)}
              className={`p-1 rounded-full ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
            >
              {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
            </button>
            
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={saveEdit}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                className="flex-1 p-1 border rounded"
                autoFocus
              />
            ) : (
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.text}
              </span>
            )}

            <button
              onClick={() => startEditing(task)}
              className="p-1 text-blue-500 hover:text-blue-600"
              aria-label="Editar tarefa"
            >
              <Edit2 size={20} />
            </button>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-red-500 hover:text-red-600"
              aria-label="Excluir tarefa"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Nenhuma tarefa encontrada
          </div>
        )}
      </div>
      
      {/* Estatísticas - Feedback de usabilidade */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {tasks.length} | 
        Pendentes: {tasks.filter(t => !t.completed).length} | 
        Concluídas: {tasks.filter(t => t.completed).length}
      </div>
    </div>
  );
} 