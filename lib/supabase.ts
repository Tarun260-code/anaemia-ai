import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveScan(data: {
  risk: string
  confidence: number
  hemoglobin: number
  message: string
  location?: string
}) {
  const { error } = await supabase.from('scans').insert([data])
  if (error) console.error('Save scan error:', error)
}

export async function getRecentScans() {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) console.error('Get scans error:', error)
  return data || []
}

export async function getScanStats() {
  const { data, error } = await supabase.from('scans').select('risk')
  if (error) return { total: 0, high: 0, moderate: 0, low: 0 }
  const total = data.length
  const high = data.filter(s => s.risk === 'HIGH').length
  const moderate = data.filter(s => s.risk === 'MODERATE').length
  const low = data.filter(s => s.risk === 'LOW').length
  return { total, high, moderate, low }
}

export async function getNearestPHC(district?: string) {
  const { data, error } = await supabase
    .from('phc_centers')
    .select('*')
    .limit(5)
  if (error) console.error('Get PHC error:', error)
  return data || []
}
