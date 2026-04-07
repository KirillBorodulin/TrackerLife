import React, { useState, useEffect } from 'react'
import './App.css'
import UserMenu from './components/UserMenu'
import MoodTracker from './components/MoodTracker'
import HabitTracker from './components/HabitTracker'
import TodoTracker from './components/TodoTracker'

function App() {
  const [activeTab, setActiveTab] = useState('mood')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-main">
          <h1>📊 Мой Трекер</h1>
          <UserMenu user={user} onLogin={handleLogin} onLogout={handleLogout} />
        </div>
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
        {activeTab === 'mood' && <MoodTracker userEmail={user?.email} />}
        {activeTab === 'habits' && <HabitTracker userEmail={user?.email} />}
        {activeTab === 'todos' && <TodoTracker userEmail={user?.email} />}
      </main>
    </div>
  )
}

export default App