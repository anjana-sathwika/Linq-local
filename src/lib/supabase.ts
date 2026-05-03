import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kxhzxjfiwtjcpfklomva.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aHp4amZpd3RqY3Bma2xvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDExOTMsImV4cCI6MjA5MzI3NzE5M30.KQfEP-AKKeYfeow4qg8BB6ZbDnf9iuxmIXPHuSLOqME'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
