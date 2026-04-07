import React, { useState, useEffect } from 'react'
import './MoodTracker.css'

const MoodTracker = ({ userEmail }) => {
  const [selectedMoods, setSelectedMoods] = useState([])
  const [notes, setNotes] = useState('')
  const [moodHistory, setMoodHistory] = useState([])
  const [currentDate, setCurrentDate] = useState('')
  const [moodLimit, setMoodLimit] = useState(3) // Лимит по умолчанию 3
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
      // Без лимита - можно сколько угодно
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