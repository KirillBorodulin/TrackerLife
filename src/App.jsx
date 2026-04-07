import React, { useState, useEffect } from 'react'
import './App.css'
import UserMenu from './components/UserMenu'
import MoodTracker from './components/MoodTracker'
import HabitTracker from './components/HabitTracker'
import TodoTracker from './components/TodoTracker'
import { supabase } from './lib/supabaseClient'
import AuthModal from './components/AuthModal'

function App() {
  const [activeTab, setActiveTab] = useState('mood')
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем текущую сессию при загрузке
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    checkSession()

    // Слушаем изменения авторизации (вход/выход)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="App">
        <div className="auth-container">
          <div className="auth-card">
            <h1>📊 Трекер привычек</h1>
            <p>Отслеживай настроение, привычки и важные дела</p>
            <button className="auth-btn" onClick={() => setShowAuthModal(true)}>
              Войти / Зарегистрироваться
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-main">
          <h1>📊 Мой Трекер</h1>
          <UserMenu user={user} onLogout={() => supabase.auth.signOut()} />
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
        {activeTab === 'mood' && <MoodTracker userId={user.id} />}
        {activeTab === 'habits' && <HabitTracker userId={user.id} />}
        {activeTab === 'todos' && <TodoTracker userId={user.id} />}
      </main>
    </div>
  )
}

export default App