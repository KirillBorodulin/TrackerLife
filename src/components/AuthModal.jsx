import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!cleanEmail.includes('@')) {
      setError('Введите корректный email адрес')
      setLoading(false)
      return
    }

    if (!isLogin && cleanPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password: cleanPassword
        })
        
        if (error) {
          if (error.message === 'Invalid login credentials') {
            setError('Неверный email или пароль')
          } else if (error.message.includes('Email not confirmed')) {
            setError('Email не подтвержден. Проверьте почту')
          } else {
            setError(error.message)
          }
        } else {
          onClose()
          setEmail('')
          setPassword('')
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password: cleanPassword,
          options: {
            emailRedirectTo: window.location.origin,
          }
        })
        
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Этот email уже зарегистрирован')
          } else {
            setError(error.message)
          }
        } else if (data.user) {
          setMessage('Регистрация успешна! Теперь войдите в аккаунт.')
          setTimeout(() => {
            setIsLogin(true)
            setMessage('')
            setPassword('')
          }, 2000)
        }
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Введите email для сброса пароля')
      return
    }
    
    setLoading(true)
    setError('')
    setMessage('')
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Инструкции по сбросу пароля отправлены на ваш email')
      setTimeout(() => {
        setShowResetPassword(false)
      }, 3000)
    }
    setLoading(false)
  }

  const switchMode = (mode) => {
    setIsLogin(mode)
    setShowResetPassword(false)
    setError('')
    setMessage('')
    setPassword('')
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-modal-header">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Мой Трекер</span>
          </div>
          
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin && !showResetPassword ? 'active' : ''}`}
              onClick={() => switchMode(true)}
            >
              <span className="tab-icon">🔐</span>
              Вход
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => switchMode(false)}
            >
              <span className="tab-icon">✨</span>
              Регистрация
            </button>
          </div>
        </div>

        {showResetPassword ? (
          <div className="reset-password-form">
            <h3>Сброс пароля</h3>
            <p>Введите ваш email, и мы отправим инструкции для восстановления пароля</p>
            <div className="form-group">
              <label>Email адрес</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <button 
              onClick={handleResetPassword} 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Отправить инструкции'}
            </button>
            <button 
              onClick={() => setShowResetPassword(false)}
              className="back-button"
            >
              ← Вернуться ко входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email адрес</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Пароль</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder={isLogin ? "Введите пароль" : "Придумайте пароль (мин. 6 символов)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={!isLogin ? 6 : undefined}
                  disabled={loading}
                />
              </div>
              {!isLogin && (
                <div className="input-hint">Пароль должен содержать не менее 6 символов</div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>

            {isLogin && (
              <button 
                type="button" 
                onClick={() => setShowResetPassword(true)}
                className="forgot-link"
              >
                Забыли пароль?
              </button>
            )}
          </form>
        )}

        {!showResetPassword && (
          <div className="auth-footer">
            <div className="divider">
              <span>или</span>
            </div>
            {isLogin ? (
              <p>
                Нет аккаунта?{' '}
                <button type="button" onClick={() => switchMode(false)}>
                  Создать аккаунт
                </button>
              </p>
            ) : (
              <p>
                Уже есть аккаунт?{' '}
                <button type="button" onClick={() => switchMode(true)}>
                  Войти
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal