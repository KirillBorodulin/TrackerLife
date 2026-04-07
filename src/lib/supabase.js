import { createClient } from '@supabase/supabase-js'

// ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ из Settings → API
const supabaseUrl = 'https://sfentwedoanljzxqjdms.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZW50d2Vkb2FubGp6eHFqZG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTMzMzAsImV4cCI6MjA5MTEyOTMzMH0.Toz5VtTKSGmaBHZ80HteEVZoZxSr1Ig4I1leIGl9Zq0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)