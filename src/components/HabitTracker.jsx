import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import WeatherWidget from "./WeatherWidget";
import { sanitizeInput } from '../utils/security'
import './HabitTracker.css'

const HabitTracker = ({ userId }) => {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [reward, setReward] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [expandedHabits, setExpandedHabits] = useState({})
  const [loading, setLoading] = useState(true)
  const [showExportModal, setShowExportModal] = useState(false)

  const MAX_HABITS = 20

  useEffect(() => {
    const fetchHabits = async () => {
      if (!userId) {
        console.log('No userId provided')
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        const formattedHabits = data.map(habit => ({
          id: habit.id,
          name: sanitizeInput(habit.name),
          reward: sanitizeInput(habit.description) || '🎁',
          completions: habit.completions || {},
          createdAt: habit.created_at
        }))
        
        setHabits(formattedHabits)
      } catch (error) {
        console.error('Error fetching habits:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHabits()
  }, [userId])

  const addHabit = async () => {
    // Проверка лимита
    if (habits.length >= MAX_HABITS) {
      alert(`Вы достигли лимита привычек (${MAX_HABITS}). Удалите ненужные привычки, чтобы добавить новые.`)
      return
    }

    const sanitizedName = sanitizeInput(newHabit)
    const sanitizedReward = sanitizeInput(reward)
    
    if (!sanitizedName) {
      alert('Введите название привычки (не более 200 символов, без HTML тегов)')
      return
    }
    
    if (!userId) {
      alert('Пожалуйста, войдите в аккаунт')
      return
    }

    const newHabitObj = {
      id: Date.now(),
      name: sanitizedName,
      reward: sanitizedReward || '🎁',
      completions: {},
      createdAt: new Date().toISOString()
    }

    setHabits([newHabitObj, ...habits])
    setExpandedHabits(prev => ({ ...prev, [newHabitObj.id]: true }))
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: userId,
          name: sanitizedName,
          description: sanitizedReward || '🎁',
          completions: {}
        })
        .select()
        .single()
      
      if (error) throw error
      
      if (data) {
        setHabits(prev => prev.map(h => 
          h.id === newHabitObj.id ? { ...h, id: data.id } : h
        ))
      }
    } catch (error) {
      console.error('Error saving habit:', error)
      alert('Ошибка сохранения привычки: ' + error.message)
    }
    
    setNewHabit('')
    setReward('')
  }

  // Экспорт данных
  const exportData = () => {
    const exportData = {
      habits: habits,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habits_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('Данные успешно экспортированы!')
    setShowExportModal(false)
  }

  // Импорт данных
  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        
        if (imported.habits && Array.isArray(imported.habits)) {
          if (imported.habits.length > MAX_HABITS) {
            alert(`Слишком много привычек! Максимум ${MAX_HABITS}. Импорт отменен.`)
            return
          }
          
          const sanitizedHabits = imported.habits.map(habit => ({
            ...habit,
            name: sanitizeInput(habit.name),
            reward: sanitizeInput(habit.reward)
          }))
          
          setHabits(sanitizedHabits)
          localStorage.setItem('habits', JSON.stringify(sanitizedHabits))
          alert(`Импортировано ${sanitizedHabits.length} привычек!`)
        } else {
          alert('Неверный формат файла')
        }
      } catch (err) {
        alert('Ошибка при импорте: ' + err.message)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const toggleDay = async (habitId, dateStr) => {
    setHabits(prevHabits => {
      const updatedHabits = prevHabits.map(habit => {
        if (habit.id === habitId) {
          const currentStatus = habit.completions[dateStr] || false
          return {
            ...habit,
            completions: {
              ...habit.completions,
              [dateStr]: !currentStatus
            }
          }
        }
        return habit
      })
      
      const updatedHabit = updatedHabits.find(h => h.id === habitId)
      if (updatedHabit && typeof habitId === 'string' && habitId.length > 20) {
        supabase
          .from('habits')
          .update({ completions: updatedHabit.completions })
          .eq('id', habitId)
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) console.error('Error updating habit:', error)
          })
      }
      
      return updatedHabits
    })
  }

  const deleteHabit = async (habitId) => {
    if (window.confirm('Удалить привычку?')) {
      try {
        const { error } = await supabase
          .from('habits')
          .delete()
          .eq('id', habitId)
          .eq('user_id', userId)
        
        if (error) throw error
        
        setHabits(habits.filter(h => h.id !== habitId))
        setExpandedHabits(prev => {
          const newState = { ...prev }
          delete newState[habitId]
          return newState
        })
      } catch (error) {
        console.error('Error deleting habit:', error)
        alert('Ошибка удаления привычки: ' + error.message)
      }
    }
  }

  const toggleExpand = (habitId) => {
    setExpandedHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }))
  }

  const getCompletionCount = (habit) => {
    return Object.values(habit.completions || {}).filter(v => v === true).length
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

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const startWeekday = firstDayOfMonth.getDay()
    let startOffset = startWeekday === 0 ? 6 : startWeekday - 1
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const calendarDays = []
    
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push({ date: null, dayNumber: null, fullDate: null })
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(currentYear, currentMonth, day)
      const dateStr = fullDate.toISOString().split('T')[0]
      calendarDays.push({
        date: fullDate,
        dayNumber: day,
        fullDate: dateStr,
        isToday: isToday(fullDate)
      })
    }
    
    return calendarDays
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

  const calendarDays = getCalendarDays()

  if (loading) {
    return (
      <div className="habit-tracker">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка привычек...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="habit-tracker">
      <div className="habit-header">
        <div className="habit-header-top">
          <h2>🔄 Трекер привычек</h2>
          <div className="habit-actions-buttons">
            <button onClick={() => setShowExportModal(true)} className="export-btn" title="Экспорт/Импорт данных">
              💾
            </button>
          </div>
        </div>
        <p>Приобретайте полезные привычки, избавляйтесь от вредных и быстрее достигайте целей!</p>
        <div className="habit-limit-info">
          📊 Привычек: {habits.length} / {MAX_HABITS}
        </div>
      </div>
            
      <div className="add-habit-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Привычка (например: Не пить кофе по утрам)"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            maxLength="200"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Вознаграждение (например: Новый гаджет)"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            maxLength="100"
          />
        </div>
        <button onClick={addHabit} className="add-habit-btn" disabled={habits.length >= MAX_HABITS}>
          {habits.length >= MAX_HABITS ? '🔒 Лимит привычек' : '➕ Добавить привычку'}
        </button>
      </div>

      {/* Модальное окно экспорта/импорта */}
      {showExportModal && (
        <div className="export-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-header">
              <h3>💾 Экспорт / Импорт данных</h3>
              <button className="close-modal-btn" onClick={() => setShowExportModal(false)}>✕</button>
            </div>
            <div className="export-modal-body">
              <button onClick={exportData} className="export-action-btn">
                📤 Экспортировать привычки
              </button>
              <div className="import-section">
                <label className="import-label">
                  📥 Импортировать привычки
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="import-hint">Выберите JSON файл с резервной копией</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="month-navigation">
        <button onClick={() => changeMonth(-1)}>← {monthNames[currentMonth === 0 ? 11 : currentMonth - 1]}</button>
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={() => changeMonth(1)}>{monthNames[currentMonth === 11 ? 0 : currentMonth + 1]} →</button>
      </div>

      <div className="habits-list">
        {habits.map(habit => {
          const isExpanded = expandedHabits[habit.id] ?? true
          const completionCount = getCompletionCount(habit)
          const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
          const percent = totalDaysInMonth > 0 ? Math.round((completionCount / totalDaysInMonth) * 100) : 0

          return (
            <div key={habit.id} className="habit-card">
              <div className="habit-info">
                <div className="habit-name">
                  <strong>{habit.name}</strong>
                  <div className="habit-actions">
                    <button 
                      onClick={() => toggleExpand(habit.id)} 
                      className="expand-btn"
                      title={isExpanded ? 'Свернуть календарь' : 'Развернуть календарь'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                    <button onClick={() => deleteHabit(habit.id)} className="delete-habit">🗑️</button>
                  </div>
                </div>
                <div className="habit-reward">
                  🎁 Вознаграждение: {habit.reward}
                </div>
                <div className="habit-stats">
                  📊 Выполнено: {completionCount} / {totalDaysInMonth} дней
                  <span className="progress-percent">({percent}%)</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="calendar-container">
                  <div className="calendar-weekdays">
                    {weekDays.map(day => (
                      <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                  </div>
                  <div className="calendar-days">
                    {calendarDays.map((day, idx) => {
                      if (day.date === null) {
                        return <div key={`empty-${idx}`} className="calendar-day empty"></div>
                      }
                      
                      const isCompleted = habit.completions[day.fullDate] || false
                      
                      return (
                        <button
                          key={day.fullDate}
                          className={`calendar-day ${isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}
                          onClick={() => toggleDay(habit.id, day.fullDate)}
                        >
                          {day.dayNumber}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}

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