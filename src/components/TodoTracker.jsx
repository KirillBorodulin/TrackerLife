import React, { useState, useEffect } from 'react'
import { parseTaskFromText } from '../utils/aiParser'
import { sanitizeInput } from '../utils/security'
import './TodoTracker.css'

const TodoTracker = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newCategory, setNewCategory] = useState('личное')
  const [filter, setFilter] = useState('all')
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const categories = ['личное', 'работа', 'учеба', 'здоровье', 'дом']

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const createTaskWithAI = () => {
    if (!aiInput.trim()) {
      alert('Введите описание задачи')
      return
    }
    
    setAiLoading(true)
    
    setTimeout(() => {
      const parsed = parseTaskFromText(aiInput)
      
      const todo = {
        id: Date.now(),
        text: sanitizeInput(parsed.text),
        completed: false,
        category: parsed.category,
        createdAt: new Date().toLocaleDateString('ru-RU'),
        dueDate: parsed.dueDate,
        time: parsed.time,
        createdByAI: true
      }
      
      setTodos([todo, ...todos])
      setAiInput('')
      alert(`✨ Задача создана!\n📁 Категория: ${parsed.category}\n${parsed.dueDate ? `📅 Дата: ${parsed.dueDate}` : ''}`)
      setAiLoading(false)
    }, 500)
  }

  const addTodo = () => {
    const sanitizedText = sanitizeInput(newTodo)
    if (!sanitizedText) return

    const todo = {
      id: Date.now(),
      text: sanitizedText,
      completed: false,
      category: newCategory,
      createdAt: new Date().toLocaleDateString('ru-RU')
    }

    setTodos([todo, ...todos])
    setNewTodo('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    if (window.confirm('Удалить дело?')) {
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    if (filter === 'all') return true
    return todo.category === filter
  })

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  }

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  return (
    <div className="todo-tracker">
      <div className="todo-header">
        <h2>📝 Важные дела и расписание</h2>
        <p>Планируйте, организуйте и достигайте большего!</p>
      </div>

      {/* AI Создание задач */}
      <div className="ai-todo-section">
        <div className="ai-input-group">
          <input
            type="text"
            placeholder="🤖 Опишите задачу словами... (например: Завтра в 15:00 позвонить клиенту)"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createTaskWithAI()}
          />
          <button onClick={createTaskWithAI} className="ai-create-btn" disabled={aiLoading}>
            {aiLoading ? '⏳' : '🤖'} AI создать
          </button>
        </div>
        <p className="ai-hint">✨ AI сам определит категорию и дату!</p>
      </div>

      <div className="todo-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Всего дел</span>
        </div>
        <div className="stat-card active-stat">
          <span className="stat-number">{stats.active}</span>
          <span className="stat-label">Активных</span>
        </div>
        <div className="stat-card completed-stat">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Выполнено</span>
        </div>
      </div>

      <div className="add-todo-section">
        <div className="todo-input-group">
          <input
            type="text"
            placeholder="Добавить новое дело..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            maxLength="200"
          />
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <button onClick={addTodo} className="add-todo-btn">➕</button>
        </div>
      </div>

      <div className="todo-filters">
        <button className={filter === 'all' ? 'filter-active' : ''} onClick={() => setFilter('all')}>
          Все
        </button>
        <button className={filter === 'active' ? 'filter-active' : ''} onClick={() => setFilter('active')}>
          Активные
        </button>
        <button className={filter === 'completed' ? 'filter-active' : ''} onClick={() => setFilter('completed')}>
          Выполненные
        </button>
        {categories.map(cat => (
          <button key={cat} className={filter === cat ? 'filter-active' : ''} onClick={() => setFilter(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="todos-list">
        {filteredTodos.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <div className="todo-meta">
                <span className="todo-category">{todo.category}</span>
                <span className="todo-date">{todo.createdAt}</span>
                {todo.dueDate && <span className="todo-due">📅 {todo.dueDate}</span>}
                {todo.createdByAI && <span className="todo-ai-badge">🤖 AI</span>}
              </div>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="delete-todo">🗑️</button>
          </div>
        ))}
        
        {filteredTodos.length === 0 && (
          <div className="empty-todos">
            <p>✨ Нет дел в этой категории</p>
            <p className="hint">Добавьте новое дело выше или используйте AI!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoTracker