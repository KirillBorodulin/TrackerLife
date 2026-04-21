import React, { useState, useEffect } from 'react'
import './WeatherWidget.css'

const WeatherWidget = () => {
  const [city, setCity] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showWidget, setShowWidget] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [lastCity, setLastCity] = useState('')

  useEffect(() => {
    const savedCity = localStorage.getItem('lastWeatherCity')
    if (savedCity) {
      try {
        const parsed = JSON.parse(savedCity)
        setLastCity(parsed.city)
      } catch (e) {
        console.error('Ошибка загрузки сохраненного города:', e)
      }
    }
  }, [])

  const searchCities = async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ru&format=json`
      )
      const data = await response.json()
      
      if (data.results) {
        setSuggestions(data.results.map(cityItem => ({
          name: cityItem.name,
          country: cityItem.country,
          latitude: cityItem.latitude,
          longitude: cityItem.longitude,
          displayName: `${cityItem.name}, ${cityItem.country}`
        })))
      } else {
        setSuggestions([])
      }
    } catch (err) {
      console.error('Ошибка поиска города:', err)
      setSuggestions([])
    }
  }

  const fetchWeather = async (lat, lon, cityName) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      )
      
      if (!response.ok) throw new Error('Ошибка загрузки погоды')
      
      const data = await response.json()
      
      const weatherData = {
        temperature: Math.round(data.current_weather.temperature),
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
        city: cityName
      }
      
      setWeather(weatherData)
      localStorage.setItem('lastWeatherCity', JSON.stringify({ city: cityName, lat, lon }))
      setLastCity(cityName)
      setShowWidget(true)
      
    } catch (err) {
      setError('Не удалось загрузить погоду. Попробуйте позже.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const selectCity = (cityItem) => {
    const displayName = `${cityItem.name}, ${cityItem.country}`
    setSearchCity(displayName)
    setCity(displayName)
    setSuggestions([])
    setShowSuggestions(false)
    fetchWeather(cityItem.latitude, cityItem.longitude, displayName)
  }

  const handleSearch = () => {
    if (city && typeof city === 'string' && city.length > 0) {
      const selectedSuggestion = suggestions.find(s => `${s.name}, ${s.country}` === city)
      if (selectedSuggestion) {
        fetchWeather(selectedSuggestion.latitude, selectedSuggestion.longitude, city)
      } else {
        setError('Пожалуйста, выберите город из списка')
      }
    } else if (searchCity) {
      setError('Пожалуйста, выберите город из списка')
    } else {
      setError('Введите название города')
    }
  }

  const openWidget = () => {
    setShowWidget(true)
    setSearchCity('')
    setCity('')
    setSuggestions([])
    setError('')
  }

  const closeWidget = () => {
    setShowWidget(false)
  }

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
    if (temperature < -10) return 'Очень холодно! Одевайтесь максимально тепло'
    if (temperature < 0) return 'На улице мороз, не забудьте шапку и перчатки'
    if (temperature < 10) return 'Прохладно, лучше одеться теплее'
    if (temperature > 30) return 'Очень жарко! Пейте больше воды'
    if (temperature > 25) return 'Отличная погода для прогулки!'
    if (windspeed > 30) return 'Сильный ветер, будьте осторожны'
    return 'Комфортная погода для вас'
  }

  return (
    <div className="weather-widget-container">
      <button 
        className="weather-toggle-btn"
        onClick={openWidget}
      >
        🌤️ Погода {lastCity && `в ${lastCity}`}
      </button>

      {showWidget && (
        <div className="weather-modal">
          <div className="weather-modal-header">
            <h3>Погода в вашем городе</h3>
            <button className="close-btn" onClick={closeWidget}>✕</button>
          </div>

          <div className="weather-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Введите название города..."
                value={searchCity}
                onChange={(e) => {
                  setSearchCity(e.target.value)
                  searchCities(e.target.value)
                  setShowSuggestions(true)
                  setError('')
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => selectCity(suggestion)}
                    >
                      <span className="city-name">{suggestion.name}</span>
                      <span className="country-name">{suggestion.country}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSearch} disabled={loading}>
              {loading ? '⏳' : 'Найти'}
            </button>
          </div>

          {error && <div className="weather-error">{error}</div>}

          {weather && !loading && (
            <div className="weather-info">
              <div className="weather-location">
                {weather.city}
              </div>
              
              <div className="weather-main">
                <div className="weather-icon">
                  {getWeatherIcon(weather.temperature)}
                </div>
                <div className="weather-temperature">
                  {weather.temperature}°C
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span>💨 Ветер: {weather.windspeed} км/ч</span>
                  <span className="detail-small">({getWindDirection(weather.winddirection)})</span>
                </div>
              </div>

              <div className="weather-advice">
                {getWeatherAdvice(weather.temperature, weather.windspeed)}
              </div>

              <div className="weather-note">
                <small>Данные обновлены сейчас</small>
              </div>
            </div>
          )}

          {loading && (
            <div className="weather-loading">
              <div className="spinner"></div>
              <p>Загрузка погоды...</p>
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="weather-empty">
              <p>Введите название города и нажмите "Найти"</p>
              <p className="weather-hint">Например: Москва, Санкт-Петербург, Лондон</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WeatherWidget