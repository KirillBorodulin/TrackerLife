import React, { useState, useEffect } from 'react'
import './HabitTracker.css'

const HabitTracker = () => {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [reward, setReward] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const today = new Date().getDate()

  useEffect(() => {
    const saved = localStorage.getItem('habits')
    if (saved) {
      setHabits(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (!newHabit.trim()) {
      alert('Введите название привычки')
      return
    }

    const habit = {
      id: Date.now(),
      name: newHabit,
      reward: reward || '🎁',
      completions: {},
      createdAt: new Date().toISOString()
    }

    setHabits([...habits, habit])
    setNewHabit('')
    setReward('')
  }

  const toggleDay = (habitId, day) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const currentStatus = habit.completions[day] || false
        return {
          ...habit,
          completions: {
            ...habit.completions,
            [day]: !currentStatus
          }
        }
      }
      return habit
    }))
  }

  const deleteHabit = (habitId) => {
    if (window.confirm('Удалить привычку?')) {
      setHabits(habits.filter(h => h.id !== habitId))
    }
  }

  const getCompletionCount = (habit) => {
    return Object.values(habit.completions).filter(v => v === true).length
  }

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta
    let newYear = currentYear
    
    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }
    
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

  return (
    <div className="habit-tracker">
      <div className="habit-header">
        <h2>🔄 Трекер привычек</h2>
        <p>Приобретайте полезные привычки, избавляйтесь от вредных и быстрее достигайте целей!</p>
      </div>

      <div className="add-habit-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Привычка (например: Не пить кофе по утрам)"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Вознаграждение (например: Новый гаджет)"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        <button onClick={addHabit} className="add-habit-btn">➕ Добавить привычку</button>
      </div>

      <div className="month-navigation">
        <button onClick={() => changeMonth(-1)}>← {monthNames[currentMonth === 0 ? 11 : currentMonth - 1]}</button>
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={() => changeMonth(1)}>{monthNames[currentMonth === 11 ? 0 : currentMonth + 1]} →</button>
      </div>

      <div className="habits-list">
        {habits.map(habit => (
          <div key={habit.id} className="habit-card">
            <div className="habit-info">
              <div className="habit-name">
                <strong>{habit.name}</strong>
                <button onClick={() => deleteHabit(habit.id)} className="delete-habit">🗑️</button>
              </div>
              <div className="habit-reward">
                🎁 Вознаграждение: {habit.reward}
              </div>
              <div className="habit-stats">
                📊 Выполнено: {getCompletionCount(habit)} / {daysInMonth} дней
                <span className="progress-percent">
                  ({Math.round((getCompletionCount(habit) / daysInMonth) * 100)}%)
                </span>
              </div>
            </div>
            
            <div className="days-grid">
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1
                const isCompleted = habit.completions[day] || false
                const isToday = day === today && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                
                return (
                  <button
                    key={day}
                    className={`day-btn ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => toggleDay(habit.id, day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        
        {habits.length === 0 && (
          <div className="empty-state">
            <p>✨ Нет привычек. Добавьте первую привычку выше!</p>
            <p className="hint">Например: «Медитация 10 минут», «Читать 30 страниц», «Не пить кофе»</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HabitTracker