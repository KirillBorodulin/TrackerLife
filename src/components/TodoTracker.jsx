import React, { useState, useEffect } from 'react'
import './TodoTracker.css'

const TodoTracker = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newCategory, setNewCategory] = useState('личное')
  const [filter, setFilter] = useState('all')

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

  const addTodo = () => {
    if (!newTodo.trim()) return

    const todo = {
      id: Date.now(),
      text: newTodo,
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

      <div className="schedule-preview">
        <h3>📅 Расписание на неделю</h3>
        <div className="week-grid">
          {weekDays.map((day, index) => (
            <div key={index} className={`week-day ${index === adjustedToday ? 'today' : ''}`}>
              <div className="day-name">{day}</div>
              <div className="day-tasks">
                <span className="task-placeholder">✏️</span>
              </div>
            </div>
          ))}
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
              </div>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="delete-todo">🗑️</button>
          </div>
        ))}
        
        {filteredTodos.length === 0 && (
          <div className="empty-todos">
            <p>✨ Нет дел в этой категории</p>
            <p className="hint">Добавьте новое дело выше!</p>
          </div>
        )}
      </div>

      <div className="productivity-tips">
        <h4>💡 Полезные привычки для продуктивности</h4>
        <ul>
          <li>📖 Быть открытым и любезным</li>
          <li>⚖️ Быть честным и строгим</li>
          <li>🧠 Быть мудрым и умным</li>
          <li>⚡ Быть активным и энергичным</li>
          <li>🎯 Быть компетентным и умным</li>
          <li>💪 Быть способным к саморазвитию</li>
          <li>🌟 Быть позитивным и оптимистичным</li>
          <li>🎨 Быть творческим и инновативным</li>
        </ul>
      </div>
    </div>
  )
}

export default TodoTracker