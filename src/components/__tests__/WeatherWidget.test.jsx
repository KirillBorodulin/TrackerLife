import { describe, it, expect } from 'vitest'

// Функции из WeatherWidget
const getWindDirection = (degrees) => {
  if (degrees === undefined) return 'неизвестно'
  const directions = ['северный', 'северо-восточный', 'восточный', 'юго-восточный', 
                      'южный', 'юго-западный', 'западный', 'северо-западный']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

const getWeatherIcon = (temperature) => {
  if (temperature < -15) return '🥶'
  if (temperature < -5) return '❄️'
  if (temperature < 0) return '☃️'
  if (temperature < 10) return '☁️'
  if (temperature < 20) return '⛅'
  if (temperature < 30) return '☀️'
  return '🔥'
}

const getWeatherAdvice = (temperature, windspeed) => {
  if (temperature < -10) return '🥶 Очень холодно! Одевайтесь максимально тепло'
  if (temperature < 0) return '🧥 На улице мороз, не забудьте шапку и перчатки'
  if (temperature < 10) return '🧣 Прохладно, лучше одеться теплее'
  if (temperature > 30) return '🥵 Очень жарко! Пейте больше воды'
  if (temperature > 25) return '☀️ Отличная погода для прогулки!'
  if (windspeed > 30) return '💨 Сильный ветер, будьте осторожны'
  return '🌡️ Комфортная погода для ваших привычек'
}

describe('WeatherWidget - Форматирование погоды', () => {
  it('должен правильно определять направление ветра', () => {
    expect(getWindDirection(0)).toBe('северный')
    expect(getWindDirection(90)).toBe('восточный')
    expect(getWindDirection(180)).toBe('южный')
    expect(getWindDirection(270)).toBe('западный')
  })

  it('должен возвращать "неизвестно" если градусы не указаны', () => {
    expect(getWindDirection(undefined)).toBe('неизвестно')
  })

  it('должен выбирать правильную иконку в зависимости от температуры', () => {
    expect(getWeatherIcon(-20)).toBe('🥶')
    expect(getWeatherIcon(-10)).toBe('❄️')
    expect(getWeatherIcon(-3)).toBe('☃️')
    expect(getWeatherIcon(5)).toBe('☁️')
    expect(getWeatherIcon(15)).toBe('⛅')
    expect(getWeatherIcon(25)).toBe('☀️')
    expect(getWeatherIcon(35)).toBe('🔥')
  })

  it('должен давать правильные советы по погоде', () => {
    expect(getWeatherAdvice(-15, 10)).toContain('Очень холодно')
    expect(getWeatherAdvice(-5, 10)).toContain('мороз')
    expect(getWeatherAdvice(5, 10)).toContain('Прохладно')
    expect(getWeatherAdvice(35, 10)).toContain('Очень жарко')
    expect(getWeatherAdvice(28, 10)).toContain('Отличная погода')
    expect(getWeatherAdvice(15, 40)).toContain('Сильный ветер')
  })

  it('должен давать нейтральный совет при комфортной погоде', () => {
    expect(getWeatherAdvice(18, 10)).toBe('🌡️ Комфортная погода для ваших привычек')
  })
})