# Project Context: TrackerLife

- Generated: 2026-04-07T11:31:04.801Z
- Files included: 23
- Files skipped: 0
- Total chars: 127693
- Est. tokens: 31924
- Compression: light
## File tree

```
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public/
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src/
│  ├─ App.css
│  ├─ App.jsx
│  ├─ components/
│  │  ├─ AuthModal.css
│  │  ├─ AuthModal.jsx
│  │  ├─ HabitTracker.css
│  │  ├─ HabitTracker.jsx
│  │  ├─ MoodTracker.css
│  │  ├─ MoodTracker.jsx
│  │  ├─ TodoTracker.css
│  │  ├─ TodoTracker.jsx
│  │  ├─ UserMenu.css
│  │  └─ UserMenu.jsx
│  ├─ index.css
│  ├─ lib/
│  │  └─ supabase.js
│  └─ main.jsx
└─ vite.config.js
```

## /src/components/AuthModal.jsx

```jsx
import React, { useState } from 'react'
import './AuthModal.css'

const AuthModal = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isLogin) {

      const users = JSON.parse(localStorage.getItem('users') || '{}')
      if (users[email] && users[email].password === password) {
        const userData = {
          email,
          username: users[email].username
        }
        localStorage.setItem('currentUser', JSON.stringify(userData))
        onLogin(userData)
        onClose()
      } else {
        setError('Неверный email или пароль')
      }
    } else {

      const users = JSON.parse(localStorage.getItem('users') || '{}')
      if (users[email]) {
        setError('Пользователь с таким email уже существует')
        return
      }
      if (!username.trim()) {
        setError('Введите имя пользователя')
        return
      }
      users[email] = { password, username }
      localStorage.setItem('users', JSON.stringify(users))

      const userData = { email, username }
      localStorage.setItem('currentUser', JSON.stringify(userData))
      setSuccess('Регистрация успешна!')
      setTimeout(() => {
        onLogin(userData)
        onClose()
      }, 1000)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>✕</button>

        <div className="auth-modal-header">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); setSuccess('') }}
            >
              Вход
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); setSuccess('') }}
            >
              Регистрация
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>👤 Имя пользователя</label>
              <input
                type="text"
                placeholder="Как вас называть?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>🔒 Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="auth-submit">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>Нет аккаунта? <button onClick={() => { setIsLogin(false); setError(''); setSuccess('') }}>Зарегистрируйтесь</button></p>
          ) : (
            <p>Уже есть аккаунт? <button onClick={() => { setIsLogin(true); setError(''); setSuccess('') }}>Войдите</button></p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal

```

## /src/components/HabitTracker.css

```css
.habit-tracker {
  animation: fadeIn 0.5s ease;
}

.habit-header {
  text-align: center;
  margin-bottom: 30px;
}

.habit-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.habit-header p {
  color: #666;
  font-size: 14px;
}

.add-habit-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.add-habit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-habit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 10px;
}

.month-navigation button {
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.month-navigation button:hover {
  background: #e0e0e0;
}

.month-navigation h3 {
  color: #333;
  font-size: 18px;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.habit-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s;
}

.habit-card:hover {
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
}

.habit-info {
  margin-bottom: 15px;
}

.habit-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 18px;
}

.delete-habit {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.delete-habit:hover {
  opacity: 1;
}

.habit-reward {
  color: #ff9800;
  font-size: 14px;
  margin-bottom: 5px;
}

.habit-stats {
  font-size: 13px;
  color: #666;
}

.progress-percent {
  font-weight: 600;
  color: #4caf50;
  margin-left: 5px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 6px;
  margin-top: 15px;
}

.day-btn {
  aspect-ratio: 1;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.day-btn:hover {
  transform: scale(1.05);
  background: #e8e8e8;
}

.day-btn.completed {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.day-btn.today {
  border: 2px solid #ff9800;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 10px;
  color: #ccc;
}

@media (max-width: 768px) {
  .days-grid {
    grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
    gap: 4px;
  }

  .day-btn {
    font-size: 11px;
  }

  .habit-name {
    font-size: 16px;
  }
}

```

## /src/components/HabitTracker.jsx

```jsx
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

```

## /src/components/MoodTracker.css

```css
.mood-tracker {
  animation: fadeIn 0.5s ease;
}

.tracker-header {
  text-align: center;
  margin-bottom: 30px;
}

.tracker-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.current-date {
  color: #667eea;
  font-size: 18px;
  font-weight: 600;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 30px;
}

.mood-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.mood-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.mood-card.selected {
  border-color: #667eea;
  transform: scale(1.02);
}

.mood-emoji {
  font-size: 32px;
  margin-bottom: 8px;
}

.mood-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.notes-section {
  margin-bottom: 25px;
}

.notes-section label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.notes-section textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.notes-section textarea:focus {
  outline: none;
  border-color: #667eea;
}

.save-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 30px;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.history-section h3 {
  color: #333;
  margin-bottom: 15px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.history-date {
  font-weight: 600;
  color: #667eea;
  min-width: 100px;
}

.history-mood {
  font-size: 18px;
  min-width: 120px;
}

.history-notes {
  color: #666;
  font-size: 13px;
  flex: 1;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}

.limit-settings {
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 12px;
}

.limit-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.limit-info span {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.settings-btn {
  padding: 6px 12px;
  background: #e0e0e0;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.settings-btn:hover {
  background: #d0d0d0;
}

.limit-options {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.limit-options p {
  font-size: 13px;
  margin-bottom: 10px;
  color: #333;
}

.limit-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.limit-buttons button {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.limit-buttons button:hover {
  border-color: #667eea;
}

.limit-buttons .limit-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.limit-hint {
  font-size: 11px !important;
  color: #999 !important;
  margin-top: 5px !important;
}


@media (max-width: 768px) {
  .limit-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .limit-buttons button {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .mood-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  .mood-card {
    padding: 10px 5px;
  }

  .mood-emoji {
    font-size: 24px;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }
}

```

## /src/components/MoodTracker.jsx

```jsx
import React, { useState, useEffect } from 'react'
import './MoodTracker.css'

const MoodTracker = ({ userEmail }) => {
  const [selectedMoods, setSelectedMoods] = useState([])
  const [notes, setNotes] = useState('')
  const [moodHistory, setMoodHistory] = useState([])
  const [currentDate, setCurrentDate] = useState('')
  const [moodLimit, setMoodLimit] = useState(3)
  const [showLimitSettings, setShowLimitSettings] = useState(false)

  const moods = [
    { emoji: '😊', name: 'спокойным', color: '#90EE90' },
    { emoji: '🎉', name: 'радостным', color: '#FFD700' },
    { emoji: '😟', name: 'тревожным', color: '#FFA07A' },
    { emoji: '⚡', name: 'продуктивным', color: '#87CEEB' },
    { emoji: '😤', name: 'напряжённым', color: '#F4A460' },
    { emoji: '🌟', name: 'хорошим', color: '#98FB98' },
    { emoji: '💡', name: 'вдохновляющим', color: '#DDA0DD' },
    { emoji: '😔', name: 'грустным', color: '#B0C4DE' },
    { emoji: '🏋️', name: 'тяжёлым', color: '#CD5C5C' },
    { emoji: '🍃', name: 'умиротворённым', color: '#66CDAA' },
    { emoji: '😁', name: 'счастливым', color: '#FFB6C1' },
    { emoji: '😴', name: 'ленивым', color: '#D3D3D3' },
    { emoji: '🛀', name: 'расслабленным', color: '#AFEEEE' },
    { emoji: '😠', name: 'раздражающим', color: '#FF6347' },
    { emoji: '😶', name: 'бесшабашным', color: '#E6E6FA' },
    { emoji: '🤔', name: 'нейтральным', color: '#C0C0C0' }
  ]

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood))
    } else if (moodLimit === 0) {

      setSelectedMoods([...selectedMoods, mood])
    } else if (selectedMoods.length < moodLimit) {
      setSelectedMoods([...selectedMoods, mood])
    } else {
      alert(`Вы можете выбрать не более ${moodLimit} настроений в день!${moodLimit === 0 ? '' : ' Измените лимит в настройках'}`)
    }
  }

  const changeLimit = (newLimit) => {
    setMoodLimit(newLimit)
    localStorage.setItem(`${userEmail}_moodLimit`, newLimit)
    // Если текущих выбрано больше нового лимита - обрезаем
    if (newLimit > 0 && selectedMoods.length > newLimit) {
      setSelectedMoods(selectedMoods.slice(0, newLimit))
    }
  }

  useEffect(() => {
    const today = new Date().toLocaleDateString('ru-RU')
    setCurrentDate(today)

    // Загружаем сохраненный лимит пользователя
    const savedLimit = localStorage.getItem(`${userEmail}_moodLimit`)
    if (savedLimit !== null) {
      setMoodLimit(parseInt(savedLimit))
    }

    const storageKey = `moodHistory_${userEmail}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setMoodHistory(JSON.parse(saved))
    }

    const todayMood = JSON.parse(localStorage.getItem(`${storageKey}_today`))
    if (todayMood && todayMood.date === today) {
      setSelectedMoods(todayMood.moods || [])
      setNotes(todayMood.notes || '')
    }
  }, [userEmail])

  const saveMood = () => {
    if (selectedMoods.length === 0) {
      alert('Пожалуйста, выберите хотя бы одно настроение')
      return
    }

    const today = new Date().toLocaleDateString('ru-RU')
    const storageKey = `moodHistory_${userEmail}`
    const newEntry = {
      date: today,
      moods: selectedMoods,
      notes: notes,
      timestamp: Date.now()
    }

    const updatedHistory = [...moodHistory.filter(m => m.date !== today), newEntry]
    setMoodHistory(updatedHistory)
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory))
    localStorage.setItem(`${storageKey}_today`, JSON.stringify(newEntry))

    const limitText = moodLimit === 0 ? 'безлимитно' : `${selectedMoods.length}/${moodLimit}`
    alert(`Настроение сохранено! (${limitText}) 🌟`)
  }

  const getMoodNames = (moodEmojis) => {
    return moodEmojis.map(emoji => {
      const mood = moods.find(m => m.emoji === emoji)
      return mood ? mood.name : ''
    }).join(', ')
  }

  const getLimitText = () => {
    if (moodLimit === 0) return 'безлимитно'
    return `${selectedMoods.length}/${moodLimit}`
  }

  return (
    <div className="mood-tracker">
      <div className="tracker-header">
        <h2>🎭 Каким стал этот день для меня?</h2>
        <p className="current-date">{currentDate}</p>

        {/* Настройки лимита */}
        <div className="limit-settings">
          <div className="limit-info">
            <span>📊 Выбрано настроений: {getLimitText()}</span>
            <button
              className="settings-btn"
              onClick={() => setShowLimitSettings(!showLimitSettings)}
            >
              ⚙️ Настроить лимит
            </button>
          </div>

          {showLimitSettings && (
            <div className="limit-options">
              <p>Сколько настроений можно выбрать в день?</p>
              <div className="limit-buttons">
                <button
                  className={moodLimit === 1 ? 'limit-active' : ''}
                  onClick={() => changeLimit(1)}
                >
                  1
                </button>
                <button
                  className={moodLimit === 2 ? 'limit-active' : ''}
                  onClick={() => changeLimit(2)}
                >
                  2
                </button>
                <button
                  className={moodLimit === 3 ? 'limit-active' : ''}
                  onClick={() => changeLimit(3)}
                >
                  3
                </button>
                <button
                  className={moodLimit === 5 ? 'limit-active' : ''}
                  onClick={() => changeLimit(5)}
                >
                  5
                </button>
                <button
                  className={moodLimit === 10 ? 'limit-active' : ''}
                  onClick={() => changeLimit(10)}
                >
                  10
                </button>
                <button
                  className={moodLimit === 0 ? 'limit-active' : ''}
                  onClick={() => changeLimit(0)}
                >
                  ♾️ Без лимита
                </button>
              </div>
              <p className="limit-hint">Выберите, сколько эмоций можно отметить за день</p>
            </div>
          )}
        </div>
      </div>

      <div className="mood-grid">
        {moods.map((mood, index) => {
          const isSelected = selectedMoods.includes(mood.emoji)
          const isLimitReached = moodLimit > 0 && selectedMoods.length >= moodLimit && !isSelected

          return (
            <div
              key={index}
              className={`mood-card ${isSelected ? 'selected' : ''}`}
              style={{
                backgroundColor: isSelected ? mood.color : '#f5f5f5',
                opacity: isLimitReached ? 0.4 : 1,
                cursor: isLimitReached ? 'not-allowed' : 'pointer'
              }}
              onClick={() => !isLimitReached && toggleMood(mood.emoji)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-name">{mood.name}</span>
            </div>
          )
        })}
      </div>

      <div className="notes-section">
        <label>📝 Заметки, озарения</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Запишите свои мысли, инсайты или важные моменты дня..."
          rows="4"
        />
      </div>

      <button className="save-button" onClick={saveMood}>
        Сохранить день ✨
      </button>

      <div className="history-section">
        <h3>📅 История настроений</h3>
        <div className="history-list">
          {[...moodHistory].reverse().slice(0, 10).map((entry, index) => (
            <div key={index} className="history-item">
              <span className="history-date">{entry.date}</span>
              <span className="history-mood">
                {entry.moods.join(' ')} ({entry.moods.length}) - {getMoodNames(entry.moods)}
              </span>
              {entry.notes && <span className="history-notes">💭 {entry.notes.substring(0, 50)}</span>}
            </div>
          ))}
          {moodHistory.length === 0 && (
            <p className="no-data">Пока нет записей. Выберите настроение и сохраните день!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MoodTracker

```

## /src/components/TodoTracker.css

```css
.todo-tracker {
  animation: fadeIn 0.5s ease;
}

.todo-header {
  text-align: center;
  margin-bottom: 30px;
}

.todo-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.todo-header p {
  color: #666;
  font-size: 14px;
}

.todo-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 15px;
  border-radius: 15px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.active-stat .stat-number {
  color: #ff9800;
}

.completed-stat .stat-number {
  color: #4caf50;
}

.schedule-preview {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
}

.schedule-preview h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.week-day {
  text-align: center;
  padding: 8px;
  background: white;
  border-radius: 10px;
  transition: all 0.3s;
}

.week-day.today {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.day-name {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 5px;
}

.day-tasks {
  font-size: 12px;
  min-height: 40px;
}

.task-placeholder {
  opacity: 0.5;
  font-size: 16px;
}

.add-todo-section {
  margin-bottom: 20px;
}

.todo-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.todo-input-group input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
}

.todo-input-group select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
}

.add-todo-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-todo-btn:hover {
  transform: scale(1.05);
}

.todo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.todo-filters button {
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.todo-filters button:hover {
  background: #e0e0e0;
}

.todo-filters .filter-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.todos-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.todo-item:hover {
  transform: translateX(5px);
  background: #f0f0f0;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-content {
  flex: 1;
}

.todo-text {
  display: block;
  font-size: 15px;
  margin-bottom: 5px;
}

.todo-meta {
  display: flex;
  gap: 10px;
  font-size: 11px;
}

.todo-category {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  color: #666;
}

.todo-date {
  color: #999;
}

.delete-todo {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.delete-todo:hover {
  opacity: 1;
}

.empty-todos {
  text-align: center;
  padding: 40px;
  color: #999;
}

.productivity-tips {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
}

.productivity-tips h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 16px;
}

.productivity-tips ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  list-style: none;
}

.productivity-tips li {
  font-size: 13px;
  color: #666;
  padding: 5px 0;
}

  @media (max-width: 768px) {
  .mood-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  .mood-card {
    padding: 10px 5px;
  }

  .mood-emoji {
    font-size: 24px;
  }

  .selection-info {
    font-size: 14px;
  }
}

  @media (max-width: 480px) {
  .mood-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 6px;
  }

  .mood-emoji {
    font-size: 20px;
  }

  .mood-name {
    font-size: 10px;
  }
}

```

## /src/components/TodoTracker.jsx

```jsx
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

```

## /src/components/UserMenu.css

```css
.user-menu {
  display: flex;
  align-items: center;
}

.login-icon-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50%;
  transition: all 0.3s;
  background: #f0f0f0;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-icon-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f0f0;
  padding: 5px 15px 5px 5px;
  border-radius: 50px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s;
}

.logout-icon:hover {
  background: rgba(0,0,0,0.1);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .user-name {
    max-width: 80px;
    font-size: 12px;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  .login-icon-btn {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}

```

## /src/components/UserMenu.jsx

```jsx
import React, { useState } from 'react'
import AuthModal from './AuthModal'
import './UserMenu.css'

const UserMenu = ({ user, onLogout }) => {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <div className="user-menu">
        {user ? (
          <div className="user-info">
            <span className="user-avatar">
              {user.username ? user.username[0].toUpperCase() : '👤'}
            </span>
            <span className="user-name">{user.username || user.email}</span>
            <button onClick={onLogout} className="logout-icon" title="Выйти">
              🚪
            </button>
          </div>
        ) : (
          <button
            className="login-icon-btn"
            onClick={() => setShowAuthModal(true)}
            title="Войти / Зарегистрироваться"
          >
            👤
          </button>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={onLogout}
        />
      )}
    </>
  )
}

export default UserMenu

```

## /src/index.css

```css
:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }

  #social .button-icon {
    filter: invert(1) brightness(2);
  }
}

body {
  margin: 0;
}

#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}
h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}
p {
  margin: 0;
}

code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}

code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}

```

## /src/lib/supabase.js

```js
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://sfentwedoanljzxqjdms.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZW50d2Vkb2FubGp6eHFqZG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTMzMzAsImV4cCI6MjA5MTEyOTMzMH0.Toz5VtTKSGmaBHZ80HteEVZoZxSr1Ig4I1leIGl9Zq0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

```

## /src/main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

```

## /vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/TrackerLife/',
  server: {
    port: 3000,
    open: true
  }
})

```

