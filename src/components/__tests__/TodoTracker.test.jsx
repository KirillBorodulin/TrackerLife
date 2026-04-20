import { describe, it, expect } from 'vitest'

// Функции фильтрации из TodoTracker
const filterTodos = (todos, filter) => {
  if (filter === 'active') return todos.filter(t => !t.completed)
  if (filter === 'completed') return todos.filter(t => t.completed)
  if (filter === 'all') return todos
  return todos.filter(t => t.category === filter)
}

const getStats = (todos) => ({
  total: todos.length,
  completed: todos.filter(t => t.completed).length,
  active: todos.filter(t => !t.completed).length
})

describe('TodoTracker - Фильтрация и статистика', () => {
  const sampleTodos = [
    { id: 1, text: 'Дело 1', completed: false, category: 'работа' },
    { id: 2, text: 'Дело 2', completed: true, category: 'личное' },
    { id: 3, text: 'Дело 3', completed: false, category: 'работа' },
    { id: 4, text: 'Дело 4', completed: true, category: 'учеба' }
  ]

  it('должен правильно фильтровать активные дела', () => {
    const active = filterTodos(sampleTodos, 'active')
    expect(active.length).toBe(2)
    expect(active.every(t => !t.completed)).toBe(true)
  })

  it('должен правильно фильтровать выполненные дела', () => {
    const completed = filterTodos(sampleTodos, 'completed')
    expect(completed.length).toBe(2)
    expect(completed.every(t => t.completed)).toBe(true)
  })

  it('должен правильно фильтровать по категории', () => {
    const workTodos = filterTodos(sampleTodos, 'работа')
    expect(workTodos.length).toBe(2)
    expect(workTodos.every(t => t.category === 'работа')).toBe(true)
  })

  it('должен правильно считать статистику', () => {
    const stats = getStats(sampleTodos)
    expect(stats.total).toBe(4)
    expect(stats.completed).toBe(2)
    expect(stats.active).toBe(2)
  })

  it('должен возвращать все дела при фильтре "all"', () => {
    const all = filterTodos(sampleTodos, 'all')
    expect(all.length).toBe(4)
  })
})