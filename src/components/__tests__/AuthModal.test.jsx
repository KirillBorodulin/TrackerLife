import { describe, it, expect } from 'vitest'

// Функции валидации из AuthModal
const validateRegistration = (email, password, username) => {
  const errors = []
  
  if (!email || !email.includes('@')) {
    errors.push('Введите корректный email')
  }
  if (!password || password.length < 6) {
    errors.push('Пароль должен быть не менее 6 символов')
  }
  if (!username || username.trim().length === 0) {
    errors.push('Введите имя пользователя')
  }
  
  return { isValid: errors.length === 0, errors }
}

const validateLogin = (email, password) => {
  const errors = []
  
  if (!email || !email.includes('@')) {
    errors.push('Введите корректный email')
  }
  if (!password) {
    errors.push('Введите пароль')
  }
  
  return { isValid: errors.length === 0, errors }
}

describe('AuthModal - Валидация данных', () => {
  it('должен валидировать корректную регистрацию', () => {
    const result = validateRegistration('test@example.com', 'password123', 'TestUser')
    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
  })

  it('должен отклонять регистрацию с неверным email', () => {
    const result = validateRegistration('invalid-email', 'pass123', 'User')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Введите корректный email')
  })

  it('должен отклонять регистрацию с коротким паролем', () => {
    const result = validateRegistration('test@example.com', '123', 'User')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Пароль должен быть не менее 6 символов')
  })

  it('должен отклонять регистрацию без имени пользователя', () => {
    const result = validateRegistration('test@example.com', 'pass123', '')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Введите имя пользователя')
  })

  it('должен валидировать корректный вход', () => {
    const result = validateLogin('test@example.com', 'password123')
    expect(result.isValid).toBe(true)
  })

  it('должен отклонять вход без пароля', () => {
    const result = validateLogin('test@example.com', '')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Введите пароль')
  })
})