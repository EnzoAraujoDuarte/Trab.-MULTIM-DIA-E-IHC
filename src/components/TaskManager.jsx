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
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Aprender sobre o modelo de Shneiderman', completed: false },
    { id: 2, text: 'Implementar protótipo de interface', completed: false },
    { id: 3, text: 'Realizar testes de usabilidade', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  // Especificações de cores e layout (conforme modelo de Shneiderman)
  const COLORS = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  };

  // Gestão de tarefas
  const addTask = () => {
    if (!newTask.trim()) {
      setError('Por favor, digite uma tarefa');
      return;
    }
    setError('');
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([...tasks, { id: newId, text: newTask, completed: false }]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditTask(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) {
      setError('Por favor, digite uma tarefa');
      return;
    }
    setError('');
    setTasks(tasks.map(task => 
      task.id === editTask ? { ...task, text: editText } : task
    ));
    setEditTask(null);
  };

  // Filtro de tarefas
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
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
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nova tarefa..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Nome da tarefa"
        />
        <button 
          onClick={addTask}
          className={`${COLORS.primary} text-white p-2 rounded-r-md flex items-center`}
          aria-label="Adicionar tarefa"
        >
          <PlusCircle size={20} />
          <span className="ml-1">Adicionar</span>
        </button>
      </div>
      
      {/* Feedback de erro - Componente de usabilidade */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      {/* Filtros - Sequência de ações especificada */}
      <div className="flex mb-4 space-x-2">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Todas
        </button>
        <button 
          onClick={() => setFilter('active')} 
          className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Pendentes
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Concluídas
        </button>
      </div>
      
      {/* Lista de tarefas - Componente principal de interação */}
      <ul className="space-y-2">
        {filteredTasks.map(task => (
          <li key={task.id} className="border rounded-md p-3 flex items-center justify-between">
            {editTask === task.id ? (
              <div className="flex-1 flex">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button 
                  onClick={saveEdit} 
                  className={`${COLORS.success} text-white p-1 rounded-md ml-2`}
                  aria-label="Salvar edição"
                >
                  <CheckCircle size={20} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center flex-1">
                  <button 
                    onClick={() => toggleComplete(task.id)}
                    className="mr-2 text-gray-500 hover:text-green-500"
                    aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
                  >
                    {task.completed ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.text}
                  </span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => startEdit(task)} 
                    className="text-gray-500 hover:text-blue-500 mr-2"
                    aria-label="Editar tarefa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Remover tarefa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {filteredTasks.length === 0 && (
          <li className="text-center text-gray-500 py-4">
            Nenhuma tarefa encontrada
          </li>
        )}
      </ul>
      
      {/* Estatísticas - Feedback de usabilidade */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {tasks.length} | 
        Pendentes: {tasks.filter(t => !t.completed).length} | 
        Concluídas: {tasks.filter(t => t.completed).length}
      </div>
    </div>
  );
} 