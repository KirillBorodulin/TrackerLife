import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import './HabitTracker.css'

const HabitTracker = ({ userId }) => {
  const [habits, setHabits] = useState([])
  const [newHabitName, setNewHabitName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🔄')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const emojis = ['🔄', '💪', '📚', '🏃', '🧘', '🥗', '💧', '😴', '🎯', '✍️', '🎨', '🧹']

  useEffect(() => {
    if (userId) {
      loadHabits()
    }
  }, [userId])

  const loadHabits = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setHabits(data || [])
    } catch (err) {
      console.error('Ошибка загрузки:', err)
      setError('Не удалось загрузить привычки')
    } finally {
      setLoading(false)
    }
  }

  const addHabit = async () => {
    if (!newHabitName.trim()) return

    const newHabit = {
      user_id: userId,
      name: newHabitName.trim(),
      emoji: selectedEmoji,
      streak: 0,
      completed_today: false
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select()
        .single()

      if (error) throw error
      setHabits([...habits, data])
      setNewHabitName('')
      setSelectedEmoji('🔄')
    } catch (err) {
      console.error('Ошибка добавления:', err)
      setError('Не удалось добавить привычку')
    }
  }

  const deleteHabit = async (id) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)

      if (error) throw error
      setHabits(habits.filter(habit => habit.id !== id))
    } catch (err) {
      console.error('Ошибка удаления:', err)
      setError('Не удалось удалить привычку')
    }
  }

  const toggleHabit = async (habit) => {
    const today = new Date().toISOString().split('T')[0]
    const newCompleted = !habit.completed_today
    const newStreak = newCompleted ? (habit.streak + 1) : Math.max(0, habit.streak - 1)

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          completed_today: newCompleted,
          streak: newStreak,
          last_completed_date: newCompleted ? today : null
        })
        .eq('id', habit.id)

      if (error) throw error
      
      setHabits(habits.map(h => 
        h.id === habit.id 
          ? { ...h, completed_today: newCompleted, streak: newStreak }
          : h
      ))
    } catch (err) {
      console.error('Ошибка обновления:', err)
      setError('Не удалось обновить привычку')
    }
  }

  if (loading) return <div className="loading">Загрузка привычек...</div>

  return (
    <div className="habit-tracker">
      <div className="tracker-header">
        <h2>🔄 Привычки</h2>
        <div className="add-habit">
          <div className="emoji-selector">
            {emojis.map(emoji => (
              <button
                key={emoji}
                className={`emoji-btn ${selectedEmoji === emoji ? 'active' : ''}`}
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="habit-input">
            <input
              type="text"
              placeholder="Новая привычка..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <button onClick={addHabit}>+ Добавить</button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="habits-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>✨ Нет привычек</p>
            <p>Добавьте первую привычку, чтобы начать!</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="habit-card">
              <div className="habit-info">
                <span className="habit-emoji">{habit.emoji || '🔄'}</span>
                <span className="habit-name">{habit.name}</span>
                <span className="habit-streak">🔥 {habit.streak || 0} дней</span>
              </div>
              <div className="habit-actions">
                <button 
                  className={`check-btn ${habit.completed_today ? 'completed' : ''}`}
                  onClick={() => toggleHabit(habit)}
                >
                  {habit.completed_today ? '✅' : '⬜'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteHabit(habit.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HabitTracker