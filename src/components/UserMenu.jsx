import React from 'react'
import { sanitizeInput } from '../utils/security'
import './UserMenu.css'

const UserMenu = ({ user, onLogout }) => {
  if (!user) return null

  const getUserInitial = () => {
    if (!user.email) return '👤'
    // Санитизируем email перед использованием
    const cleanEmail = sanitizeInput(user.email)
    return cleanEmail[0] ? cleanEmail[0].toUpperCase() : '👤'
  }

  const getUserName = () => {
    if (!user.email) return 'Пользователь'
    // Санитизируем email и берем часть до @
    const cleanEmail = sanitizeInput(user.email)
    const username = cleanEmail.split('@')[0]
    // Ограничиваем длину имени
    return username.length > 20 ? username.slice(0, 17) + '...' : username
  }

  const getDisplayEmail = () => {
    if (!user.email) return ''
    // Санитизируем email для безопасного отображения
    return sanitizeInput(user.email)
  }

  // Безопасный logout с подтверждением (опционально)
  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      onLogout()
    }
  }

  return (
    <div className="user-menu">
      <div className="user-info">
        <span className="user-avatar" title={getDisplayEmail()}>
          {getUserInitial()}
        </span>
        <span className="user-name" title={getDisplayEmail()}>
          {getUserName()}
        </span>
        <button 
          onClick={handleLogout} 
          className="logout-icon" 
          title="Выйти"
          aria-label="Выйти из аккаунта"
        >
          🚪
        </button>
      </div>
    </div>
  )
}

export default UserMenu