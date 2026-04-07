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
      // Вход
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
      // Регистрация
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