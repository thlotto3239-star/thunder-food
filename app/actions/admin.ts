'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// B-05 Fixed: Removed email from users join (not in public.users schema)
// B-06 Fixed: is_verified now exists after migration
async function isAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}

export async function getAdminDashboardStats() {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const [usersCount, restaurantsCount, ordersCount, ridersCount] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('restaurants').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'rider'),
  ])

  return {
    data: {
      users: usersCount.count || 0,
      restaurants: restaurantsCount.count || 0,
      orders: ordersCount.count || 0,
      riders: ridersCount.count || 0,
    }
  }
}

export async function getUnverifiedRestaurants() {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  // B-05 Fixed: users join only has columns that exist (no email)
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, users!owner_id(full_name, phone)')
    .eq('is_verified', false) // B-06 Fixed: is_verified column now exists
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function verifyRestaurant(restaurantId: string) {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  // B-06 Fixed: is_verified column now exists after migration
  const { error } = await supabase
    .from('restaurants')
    .update({ is_verified: true })
    .eq('id', restaurantId)

  if (error) return { error: error.message }

  revalidatePath('/admin/restaurants')
  return { success: true }
}

export async function getAllUsers() {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, phone, role, avatar_url, created_at')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function getAllOrders() {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (name, image_url),
      users!customer_id (full_name, phone),
      users!rider_id (full_name, phone),
      order_items (quantity, price_at_time, menu_items(name))
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return { error: error.message }
  return { data }
}

export async function getAllRestaurants() {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, users!owner_id(full_name, phone)')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function toggleRestaurantOpenStatus(restaurantId: string, isOpen: boolean) {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('restaurants')
    .update({ is_open: isOpen })
    .eq('id', restaurantId)

  if (error) return { error: error.message }
  revalidatePath('/admin/restaurants')
  return { success: true }
}

export async function updateRestaurantVerification(restaurantId: string, isVerified: boolean) {
  const admin = await isAdmin()
  if (!admin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('restaurants')
    .update({ is_verified: isVerified })
    .eq('id', restaurantId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  revalidatePath('/admin/restaurants')
  return { success: true }
}
