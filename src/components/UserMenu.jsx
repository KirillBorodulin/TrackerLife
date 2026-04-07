import React, { useState } from 'react'
import './UserMenu.css'

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const getUserInitial = () => {
    return user.email ? user.email[0].toUpperCase() : 'U'
  }

  const getUserName = () => {
    return user.email ? user.email.split('@')[0] : 'Пользователь'
  }

  return (
    <div className="user-menu">
      <div className="user-avatar" onClick={() => setIsOpen(!isOpen)}>
        {getUserInitial()}
      </div>
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <strong>{getUserName()}</strong>
            <small>{user.email}</small>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu