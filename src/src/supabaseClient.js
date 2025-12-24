import { createClient } from '@supabase/supabase-js'

// 👇 ISI DENGAN DATA DARI PROJECT BARU ANDA
const supabaseUrl = 'https://lcgtthnrsbmmnqurwpab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjZ3R0aG5yc2JtbW5xdXJ3cGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NTgyNTEsImV4cCI6MjA4MjEzNDI1MX0.0FzEZpK5T4td_Dlc-V44vtUZffuZeODij4hejvgJ7sc'

export const supabase = createClient(supabaseUrl, supabaseKey)