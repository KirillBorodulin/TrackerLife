import { describe, it, expect } from 'vitest'

// Функции из MoodTracker
const checkMoodLimit = (selectedMoods, moodLimit, newMood, isSelected) => {
  if (isSelected) return true
  if (moodLimit === 0) return true
  return selectedMoods.length < moodLimit
}

const getMoodNames = (moods, moodsList) => {
  return moods.map(emoji => {
    const mood = moodsList.find(m => m.emoji === emoji)
    return mood ? mood.name : ''
  }).filter(Boolean).join(', ')
}

describe('MoodTracker - Логика выбора настроений', () => {
  const moodsList = [
    { emoji: '😊', name: 'спокойным' },
    { emoji: '🎉', name: 'радостным' },
    { emoji: '😟', name: 'тревожным' }
  ]

  it('должен разрешать добавить настроение если лимит не превышен', () => {
    expect(checkMoodLimit(['😊'], 3, '🎉', false)).toBe(true)
  })

  it('должен запрещать добавить настроение если лимит достигнут', () => {
    expect(checkMoodLimit(['😊', '🎉', '😟'], 3, '😤', false)).toBe(false)
  })

  it('должен разрешать безлимитный выбор если лимит = 0', () => {
    expect(checkMoodLimit(['😊', '🎉', '😟', '😤'], 0, '😴', false)).toBe(true)
  })

  it('должен правильно конвертировать эмодзи в названия', () => {
    expect(getMoodNames(['😊', '🎉'], moodsList)).toBe('спокойным, радостным')
  })

  it('должен возвращать пустую строку если настроений нет', () => {
    expect(getMoodNames([], moodsList)).toBe('')
  })
})
