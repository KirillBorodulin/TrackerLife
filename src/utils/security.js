// Хеширование паролей
export const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const verifyPassword = async (password, hash) => {
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

// Санитизация ввода (защита от XSS)
export const sanitizeInput = (input) => {
  if (!input) return ''
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 200)
}

// Валидация email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
  return re.test(email)
}

// Валидация пароля
export const validatePassword = (password) => {
  return password && password.length >= 6
}