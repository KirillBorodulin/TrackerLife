import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './FeedbackButton.css'

const FeedbackButton = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('suggestion')
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error'

  const messageTypes = {
    suggestion: { icon: '💡', label: 'Пожелание', color: '#10b981' },
    praise: { icon: '🎉', label: 'Похвала', color: '#f59e0b' },
    criticism: { icon: '🔍', label: 'Замечание', color: '#ef4444' },
    bug: { icon: '🐛', label: 'Баг', color: '#8b5cf6' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
      return
    }

    setIsSubmitting(true)

    const feedbackData = {
      message: message.trim(),
      message_type: messageType,
      rating: rating,
      page_url: window.location.pathname,
      user_email: user?.email || null,
      user_name: user?.username || null,
      user_id: user?.id || null
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([feedbackData])

      if (error) throw error

      setSubmitStatus('success')
      setMessage('')
      setRating(5)
      setMessageType('suggestion')
      
      setTimeout(() => {
        setSubmitStatus(null)
        setIsOpen(false)
      }, 2000)
    } catch (err) {
      console.error('Ошибка отправки:', err)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Кнопка открытия */}
      <button 
        className={`feedback-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Модальное окно обратной связи */}
      {isOpen && (
        <div className="feedback-modal">
          <div className="feedback-header">
            <h3>Обратная связь</h3>
            <p>Расскажите, что думаете о трекере</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Тип сообщения */}
            <div className="feedback-types">
              {Object.entries(messageTypes).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={`type-btn ${messageType === key ? 'active' : ''}`}
                  style={{ borderColor: messageType === key ? value.color : '#e5e7eb' }}
                  onClick={() => setMessageType(key)}
                >
                  <span>{value.icon}</span>
                  <span>{value.label}</span>
                </button>
              ))}
            </div>

            {/* Оценка (звезды) */}
            <div className="feedback-rating">
              <label>Оценка</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Текст сообщения */}
            <div className="feedback-message">
              <label>Ваше сообщение</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите, что вам нравится, что можно улучшить, или сообщите о проблеме..."
                rows="4"
                maxLength="1000"
              />
              <span className="char-counter">{message.length}/1000</span>
            </div>

            {/* Кнопка отправки */}
            <button 
              type="submit" 
              className="feedback-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
            </button>

            {/* Статус отправки */}
            {submitStatus === 'success' && (
              <div className="feedback-success">
                ✅ Спасибо за обратную связь!
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="feedback-error">
                ❌ Ошибка отправки. Попробуйте позже.
              </div>
            )}
          </form>

          <div className="feedback-footer">
            <p>Ваш отзыв поможет сделать трекер лучше!</p>
          </div>
        </div>
      )}
    </>
  )
}

export default FeedbackButton