export const dynamic = "force-dynamic";

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import RestaurantProfileClient from './RestaurantProfileClient'
import { getRestaurantProfile } from '@/app/actions/restaurant'

export default async function RestaurantProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const restaurantData = await getRestaurantProfile()

  // Get total order count for this restaurant
  let totalOrders = 0
  if (restaurantData) {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantData.id)
    totalOrders = count || 0
  }

  return <RestaurantProfileClient restaurant={restaurantData} totalOrders={totalOrders} />
}
