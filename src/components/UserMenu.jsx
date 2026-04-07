import React, { useState } from 'react'
import AuthModal from './AuthModal'
import './UserMenu.css'

const UserMenu = ({ user, onLogout }) => {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <div className="user-menu">
        {user ? (
          <div className="user-info">
            <span className="user-avatar">
              {user.username ? user.username[0].toUpperCase() : '👤'}
            </span>
            <span className="user-name">{user.username || user.email}</span>
            <button onClick={onLogout} className="logout-icon" title="Выйти">
              🚪
            </button>
          </div>
        ) : (
          <button 
            className="login-icon-btn" 
            onClick={() => setShowAuthModal(true)}
            title="Войти / Зарегистрироваться"
          >
            👤
          </button>
        )}
      </div>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={onLogout} // onLogin передается из App
        />
      )}
    </>
  )
}

export default UserMenu