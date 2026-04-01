import React, { useState, useEffect } from 'react'
import './MoodTracker.css'

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null)
  const [notes, setNotes] = useState('')
  const [moodHistory, setMoodHistory] = useState([])
  const [currentDate, setCurrentDate] = useState('')

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

  useEffect(() => {
    const today = new Date().toLocaleDateString('ru-RU')
    setCurrentDate(today)
    
    const saved = localStorage.getItem('moodHistory')
    if (saved) {
      setMoodHistory(JSON.parse(saved))
    }
    
    const todayMood = JSON.parse(localStorage.getItem('todayMood'))
    if (todayMood && todayMood.date === today) {
      setSelectedMood(todayMood.mood)
      setNotes(todayMood.notes || '')
    }
  }, [])

  const saveMood = () => {
    if (!selectedMood) {
      alert('Пожалуйста, выберите настроение')
      return
    }

    const today = new Date().toLocaleDateString('ru-RU')
    const newEntry = {
      date: today,
      mood: selectedMood,
      notes: notes,
      timestamp: Date.now()
    }

    const updatedHistory = [...moodHistory.filter(m => m.date !== today), newEntry]
    setMoodHistory(updatedHistory)
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory))
    localStorage.setItem('todayMood', JSON.stringify(newEntry))
    
    alert('Настроение сохранено! 🌟')
  }

  const getMoodName = (moodId) => {
    const mood = moods.find(m => m.emoji === moodId)
    return mood ? mood.name : ''
  }

  return (
    <div className="mood-tracker">
      <div className="tracker-header">
        <h2>🎭 Каким стал этот день для меня?</h2>
        <p className="current-date">{currentDate}</p>
      </div>

      <div className="mood-grid">
        {moods.map((mood, index) => (
          <div
            key={index}
            className={`mood-card ${selectedMood === mood.emoji ? 'selected' : ''}`}
            style={{ backgroundColor: selectedMood === mood.emoji ? mood.color : '#f5f5f5' }}
            onClick={() => setSelectedMood(mood.emoji)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-name">{mood.name}</span>
          </div>
        ))}
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
                {entry.mood} {getMoodName(entry.mood)}
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