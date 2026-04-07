import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './AuthModal.css'

function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    console.log('🔐 Попытка:', isLogin ? 'Входа' : 'Регистрации', 'для:', email)

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) {
        console.error('❌ Ошибка входа:', error.message)
        setError(error.message)
      } else {
        console.log('✅ Вход успешен:', data.user.email)
        onClose()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      })
      
      if (error) {
        console.error('❌ Ошибка регистрации:', error.message)
        setError(error.message)
      } else {
        console.log('✅ Регистрация успешна:', data.user?.email)
        setMessage('Регистрация успешна! Теперь войдите в аккаунт.')
        // Автоматически переключаем на форму входа через 2 секунды
        setTimeout(() => {
          setIsLogin(true)
          setMessage('')
          setEmail('')
          setPassword('')
        }, 2000)
      }
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Пароль (минимум 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        
        <button 
          type="button" 
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
            setMessage('')
            setEmail('')
            setPassword('')
          }} 
          className="switch-btn"
          disabled={loading}
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  )
}

export default AuthModal