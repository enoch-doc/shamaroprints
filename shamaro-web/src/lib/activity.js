import { supabase } from './supabase'

// Log any user action for accountability
export async function logActivity(userId, action, metadata = {}) {
  if (!userId) return
  try {
    await supabase
      .from('activity_log')
      .insert({
        user_id:  userId,
        action,
        metadata,
      })
  } catch (err) {
    // Fail silently — never block the UI for logging
    console.error('Activity log error:', err)
  }
}

// Update last seen timestamp
export async function updateLastSeen(userId) {
  if (!userId) return
  try {
    await supabase
      .from('profiles')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', userId)
  } catch (err) {
    console.error('Last seen error:', err)
  }
}

// Send in-app notification to user
export async function sendNotification(userId, title, message, type = 'info') {
  if (!userId) return
  try {
    await supabase
      .from('notifications')
      .insert({ user_id: userId, title, message, type })
  } catch (err) {
    console.error('Notification error:', err)
  }
}