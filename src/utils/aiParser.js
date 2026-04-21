// Парсинг задачи из текста (имитация AI)
export const parseTaskFromText = (text) => {
  const lowerText = text.toLowerCase()
  
  // Определяем категорию
  let category = 'личное'
  if (lowerText.includes('работ') || lowerText.includes('проект') || lowerText.includes('клиент') || lowerText.includes('бизнес')) {
    category = 'работа'
  } else if (lowerText.includes('учёб') || lowerText.includes('курс') || lowerText.includes('урок') || lowerText.includes('универ')) {
    category = 'учеба'
  } else if (lowerText.includes('здоров') || lowerText.includes('спорт') || lowerText.includes('зарядк') || lowerText.includes('бег')) {
    category = 'здоровье'
  } else if (lowerText.includes('дом') || lowerText.includes('убрать') || lowerText.includes('готовк')) {
    category = 'дом'
  }
  
  // Извлекаем дату
  let dueDate = null
  const today = new Date()
  
  if (lowerText.includes('завтра')) {
    dueDate = new Date(today)
    dueDate.setDate(today.getDate() + 1)
  } else if (lowerText.includes('послезавтра')) {
    dueDate = new Date(today)
    dueDate.setDate(today.getDate() + 2)
  } else if (lowerText.includes('сегодня')) {
    dueDate = today
  }
  
  // Извлекаем время
  let time = null
  const timeMatch = text.match(/(\d{1,2})[:.](\d{2})/)
  if (timeMatch) {
    time = `${timeMatch[1]}:${timeMatch[2]}`
  }
  
  // Очищаем текст задачи от служебных слов
  let taskText = text
    .replace(/завтра|сегодня|послезавтра|в \d{1,2}[:.]\d{2}/gi, '')
    .replace(/в \d{1,2} часов?/gi, '')
    .trim()
  
  // Первую букву в верхний регистр
  if (taskText.length > 0) {
    taskText = taskText[0].toUpperCase() + taskText.slice(1)
  }
  
  return {
    text: taskText || text,
    category,
    dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
    time
  }
}

// Парсинг привычки из текста
export const parseHabitFromText = (text) => {
  const lowerText = text.toLowerCase()
  
  // Определяем тип привычки
  let type = 'positive'
  if (lowerText.includes('не пить') || lowerText.includes('бросить') || lowerText.includes('отказаться')) {
    type = 'negative'
  }
  
  // Определяем вознаграждение по умолчанию
  let defaultReward = '🎁'
  if (lowerText.includes('спорт') || lowerText.includes('бег') || lowerText.includes('тренировка')) {
    defaultReward = '💪 Здоровье'
  } else if (lowerText.includes('читать') || lowerText.includes('книг')) {
    defaultReward = '📚 Новые знания'
  } else if (lowerText.includes('медитация')) {
    defaultReward = '🧘 Спокойствие'
  } else if (lowerText.includes('вода') || lowerText.includes('пить')) {
    defaultReward = '💧 Здоровье'
  }
  
  // Очищаем текст
  let habitText = text
    .replace(/нужно|надо|добавь|создай|привычку/gi, '')
    .trim()
  
  if (habitText.length > 0) {
    habitText = habitText[0].toUpperCase() + habitText.slice(1)
  }
  
  return {
    name: habitText || text,
    reward: defaultReward,
    type
  }
}
