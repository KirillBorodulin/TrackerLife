import React, { useState } from 'react'
import './App.css'
import MoodTracker from './components/MoodTracker'
import HabitTracker from './components/HabitTracker'
import TodoTracker from './components/TodoTracker'

function App() {
  const [activeTab, setActiveTab] = useState('mood')

  return (
    <div className="App">
      <header className="app-header">
        <h1>📊 Мой Трекер</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'mood' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('mood')}
          >
            😊 Настроение
          </button>
          <button 
            className={activeTab === 'habits' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('habits')}
          >
            🔄 Привычки
          </button>
          <button 
            className={activeTab === 'todos' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('todos')}
          >
            📝 Важные дела
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'mood' && <MoodTracker />}
        {activeTab === 'habits' && <HabitTracker />}
        {activeTab === 'todos' && <TodoTracker />}
      </main>
    </div>
  )
}

export default App