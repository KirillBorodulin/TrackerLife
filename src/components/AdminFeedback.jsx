import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import './AdminFeedback.css'

const AdminFeedback = ({ user, onClose }) => { // Добавлен onClose
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (user?.email === 'kirill_borodulin_2005@mail.ru') {
      loadFeedbacks()
    }
  }, [user])

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
      
      // Статистика
      const total = data.length
      const unread = data.filter(f => !f.is_read).length
      const avgRating = total > 0 ? (data.reduce((sum, f) => sum + (f.rating || 0), 0) / total).toFixed(1) : 0
      setStats({ total, unread, avgRating })
    } catch (err) {
      console.error('Ошибка загрузки:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    await supabase
      .from('feedback')
      .update({ is_read: true })
      .eq('id', id)
    
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { ...f, is_read: true } : f
    ))
    setStats({ ...stats, unread: stats.unread - 1 })
  }

  const deleteFeedback = async (id) => {
    if (window.confirm('Удалить этот отзыв?')) {
      await supabase
        .from('feedback')
        .delete()
        .eq('id', id)
      loadFeedbacks()
    }
  }

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === 'unread') return !f.is_read
    if (filter === 'read') return f.is_read
    return true
  })

  if (user?.email !== 'kirill_borodulin_2005@mail.ru') {
    return (
      <div className="admin-access-denied">
        <h2>⛔ Доступ ограничен</h2>
        <p>Эта страница только для администратора</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    )
  }

  const getTypeColor = (type) => {
    const colors = {
      suggestion: '#10b981',
      praise: '#f59e0b',
      criticism: '#ef4444',
      bug: '#8b5cf6'
    }
    return colors[type] || '#6b7280'
  }

  const getTypeIcon = (type) => {
    const icons = {
      suggestion: '💡',
      praise: '🎉',
      criticism: '🔍',
      bug: '🐛'
    }
    return icons[type] || '📝'
  }

  return (
    <div className="admin-feedback">
      <div className="admin-header">
        <h2>📋 Отзывы пользователей</h2>
        <button className="admin-close" onClick={onClose}>✕</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total || 0}</span>
          <span className="stat-label">Всего отзывов</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.unread || 0}</span>
          <span className="stat-label">Непрочитанных</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.avgRating || 0}</span>
          <span className="stat-label">Средняя оценка</span>
        </div>
      </div>
      
      <div className="admin-filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          Все ({feedbacks.length})
        </button>
        <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>
          📖 Непрочитанные ({feedbacks.filter(f => !f.is_read).length})
        </button>
        <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>
          ✅ Прочитанные ({feedbacks.filter(f => f.is_read).length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Загрузка отзывов...</div>
      ) : (
        <div className="feedback-list">
          {filteredFeedbacks.length === 0 ? (
            <div className="loading">Нет отзывов</div>
          ) : (
            filteredFeedbacks.map(feedback => (
              <div key={feedback.id} className={`feedback-card ${!feedback.is_read ? 'unread' : ''}`}>
                <div className="feedback-header-admin">
                  <div className="feedback-user">
                    <strong>
                      {getTypeIcon(feedback.message_type)} {feedback.user_name || 'Аноним'}
                    </strong>
                    <span className="user-email">{feedback.user_email || 'без email'}</span>
                  </div>
                  <div className="feedback-meta">
                    <span className="feedback-type" style={{ background: getTypeColor(feedback.message_type) }}>
                      {feedback.message_type === 'suggestion' && 'Пожелание'}
                      {feedback.message_type === 'praise' && 'Похвала'}
                      {feedback.message_type === 'criticism' && 'Замечание'}
                      {feedback.message_type === 'bug' && 'Баг'}
                    </span>
                    <span className="feedback-rating-admin">
                      {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                    </span>
                    <span className="feedback-date">
                      {new Date(feedback.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="feedback-message-admin">
                  {feedback.message}
                </div>
                <div className="feedback-actions">
                  {!feedback.is_read && (
                    <button onClick={() => markAsRead(feedback.id)} className="mark-read-btn">
                      📖 Отметить прочитанным
                    </button>
                  )}
                  <button onClick={() => deleteFeedback(feedback.id)} className="mark-read-btn" style={{ background: '#ef4444' }}>
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AdminFeedback