import React from 'react'
import './UserMenu.css'

const UserMenu = ({ user, onLogout }) => {
  if (!user) return null

  const getUserInitial = () => {
    return user.email ? user.email[0].toUpperCase() : '👤'
  }

  const getUserName = () => {
    return user.email ? user.email.split('@')[0] : 'Пользователь'
  }

  return (
    <div className="user-menu">
      <div className="user-info">
        <span className="user-avatar">
          {getUserInitial()}
        </span>
        <span className="user-name">{getUserName()}</span>
        <button onClick={onLogout} className="logout-icon" title="Выйти">
          🚪
        </button>
      </div>
    </div>
  )
}

export default UserMenu