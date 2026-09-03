import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Fetch complete user profile ──
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

// ── Fetch user notifications ──
export async function getNotifications(userId) {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  return data || []
}

// ── Mark notification as read ──
export async function markRead(notificationId) {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
}

// ── Fetch user orders with items and payment ──
export async function getUserOrders(userId) {
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      payments (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

// ── Fetch single order by code (guest tracking) ──
export async function getOrderByCode(code) {
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      payments (*)
    `)
    .eq('order_code', code.toUpperCase().trim())
    .single()
  return data || null
}