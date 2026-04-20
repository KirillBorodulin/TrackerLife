import { describe, it, expect, beforeEach } from 'vitest'

// Функция для подсчета прогресса (копия из вашего компонента)
const getCompletionCount = (completions) => {
  return Object.values(completions || {}).filter(v => v === true).length
}

const calculateProgress = (completions, totalDays) => {
  const completed = getCompletionCount(completions)
  return Math.round((completed / totalDays) * 100)
}

describe('HabitTracker - Функции подсчета прогресса', () => {
  it('должен правильно считать количество выполненных дней', () => {
    const completions = {
      1: true, 2: false, 3: true, 4: true, 5: false
    }
    expect(getCompletionCount(completions)).toBe(3)
  })

  it('должен возвращать 0 если completions пустой', () => {
    expect(getCompletionCount({})).toBe(0)
    expect(getCompletionCount(null)).toBe(0)
  })

  it('должен правильно считать процент выполнения', () => {
    const completions = { 1: true, 2: true, 3: true }
    expect(calculateProgress(completions, 30)).toBe(10)
  })

  it('должен возвращать 0% если нет выполнений', () => {
    expect(calculateProgress({}, 30)).toBe(0)
  })

  it('должен возвращать 100% если все дни выполнены', () => {
    const completions = {}
    for (let i = 1; i <= 30; i++) completions[i] = true
    expect(calculateProgress(completions, 30)).toBe(100)
  })
})