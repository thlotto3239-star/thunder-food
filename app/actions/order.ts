'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Notification helper
async function createSystemNotification(
  userId: string, 
  title: string, 
  body: string, 
  type: string = 'order', 
  metadata: any = {}
) {
  try {
    const supabase = await createClient()
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      body,
      type,
      is_read: false,
      metadata
    })
  } catch (err) {
    console.error('Error inserting system notification:', err)
  }
}

// --- Customer Actions ---

// B-07 Fixed: items now include price for price_at_time insertion
export async function createOrder(
  restaurantId: string,
  items: { menu_item_id: string; quantity: number; price: number }[],
  totalAmount: number,
  deliveryFee: number,
  deliveryAddress: any,
  paymentSlipUrl?: string,
  coupon?: { couponId: string; discount: number }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const rawPayment = deliveryAddress?.payment_method
  const paymentMethod = (rawPayment === 'cod' || rawPayment === 'cash') ? 'cash' : 'transfer'

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      restaurant_id: restaurantId,
      total_amount: totalAmount,
      delivery_fee: deliveryFee,
      delivery_address: deliveryAddress,
      status: 'pending',
      payment_method: paymentMethod,
      payment_status: 'pending',
      payment_slip_url: paymentSlipUrl,
      coupon_id: coupon?.couponId ?? null,
      discount_amount: coupon?.discount ?? 0,
    })
    .select('id')
    .single()

  if (orderError) return { error: orderError.message }

  if (coupon?.couponId) {
    const { data: couponRow } = await supabase
      .from('coupons')
      .select('used_count')
      .eq('id', coupon.couponId)
      .single()
    if (couponRow) {
      await supabase
        .from('coupons')
        .update({ used_count: couponRow.used_count + 1 })
        .eq('id', coupon.couponId)
    }
  }

  // B-07 Fixed: Include price_at_time (NOT NULL in schema)
  const orderItemsData = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_at_time: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) return { error: itemsError.message }

  // Fetch restaurant details for richer notification message
  const { data: restData } = await supabase
    .from('restaurants')
    .select('name')
    .eq('id', restaurantId)
    .single()

  const restaurantName = restData?.name || 'ร้านค้า'

  // Trigger Transactional User Notification
  await createSystemNotification(
    user.id,
    'ส่งคำสั่งซื้อสำเร็จ! 🎉',
    `ส่งรายการสั่งซื้อของคุณไปยังร้าน "${restaurantName}" เรียบร้อยแล้ว (ออเดอร์: ${order.id.slice(0, 8)})`,
    'order',
    { orderId: order.id }
  )

  revalidatePath('/customer')
  revalidatePath('/restaurant')
  return { success: true, orderId: order.id }
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // B-04 Fixed: phone_number → phone (restaurants table does not have phone, joined from owner:users!owner_id)
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (
        name, 
        address, 
        image_url,
        owner:users!owner_id (phone)
      ),
      users!rider_id (full_name, phone),
      order_items (
        quantity,
        price_at_time,
        menu_items (name, price)
      )
    `)
    .eq('id', orderId)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getCustomerOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // B-04 Fixed: phone_number → phone
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (name, image_url),
      users!rider_id (full_name, phone),
      order_items (
        quantity,
        price_at_time,
        menu_items (name, price)
      )
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

// --- Restaurant Actions ---

export async function getRestaurantOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: rest } = await supabase
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)
    .single()
  if (!rest) return { error: 'Restaurant not found' }

  // B-04 Fixed: phone_number → phone (aliased to customer)
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:users!customer_id (full_name, phone),
      order_items (
        quantity,
        price_at_time,
        menu_items (name, price)
      )
    `)
    .eq('restaurant_id', rest.id)
    .in('status', ['pending', 'preparing', 'ready'])
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function getRestaurantHistoryOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: rest } = await supabase
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)
    .single()
  if (!rest) return { error: 'Restaurant not found' }

  // B-04 Fixed: phone_number → phone (aliased to customer)
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:users!customer_id (full_name, phone),
      order_items (
        quantity,
        price_at_time,
        menu_items (name, price)
      )
    `)
    .eq('restaurant_id', rest.id)
    .in('status', ['ready', 'picking_up', 'delivering', 'completed', 'cancelled'])
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'completed' | 'cancelled') {
  const supabase = await createClient()

  // Fetch customer_id and restaurant name first to generate a detailed notification
  const { data: orderData } = await supabase
    .from('orders')
    .select('customer_id, restaurants (name)')
    .eq('id', orderId)
    .single()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return { error: error.message }

  if (orderData) {
    const restaurantName = (orderData.restaurants as any)?.name || 'ร้านค้า'
    let title = 'อัปเดตสถานะคำสั่งซื้อ 📋'
    let body = `คำสั่งซื้อของคุณปรับสถานะเป็น: ${status}`

    if (status === 'preparing') {
      title = 'ร้านค้ากำลังเตรียมอาหาร 🍳'
      body = `ร้าน "${restaurantName}" กำลังบรรจงจัดปรุงเมนูแสนอร่อยให้กับคุณอย่างตั้งใจ`
    } else if (status === 'ready') {
      title = 'ปรุงเสร็จเรียบร้อย! 🛍️'
      body = `อาหารจากร้าน "${restaurantName}" เสร็จสมบูรณ์แล้ว อยู่ในคิวรอไรเดอร์เข้ารับการเดินทาง`
    } else if (status === 'delivering') {
      title = 'ไรเดอร์กำลังมุ่งหน้าจัดส่ง 🚴'
      body = `เมนูแสนพิเศษจากร้าน "${restaurantName}" กำลังเดินทางพุ่งตรงไปหาคุณด้วยความเร็วสูง`
    } else if (status === 'completed') {
      title = 'จัดส่งสำเร็จเรียบร้อย! 🥳'
      body = `คุณได้รับอาหารจากร้าน "${restaurantName}" ครบถ้วนแล้ว ขอให้อร่อยกับมื้ออาหารนะคะ`
    } else if (status === 'cancelled') {
      title = 'คำสั่งซื้อถูกยกเลิก ❌'
      body = `ขออภัย รายการสั่งซื้อของร้าน "${restaurantName}" ถูกยกเลิกโดยระบบหรือผู้ประกอบการ`
    }

    await createSystemNotification(orderData.customer_id, title, body, 'order', { orderId })
  }

  revalidatePath('/restaurant')
  revalidatePath('/rider')
  revalidatePath('/customer')
  return { success: true }
}

// --- Rider Actions ---

export async function getAvailableDeliveries() {
  const supabase = await createClient()
  // B-04 Fixed: phone_number → phone (aliased to customer) and added owner phone for restaurants
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (
        name, 
        address, 
        lat, 
        lng,
        owner:users!owner_id (phone)
      ),
      customer:users!customer_id (full_name, phone)
    `)
    .eq('status', 'ready')
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function getMyDeliveries() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // B-04 Fixed: phone_number → phone (aliased to customer) and added owner phone for restaurants
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (
        name, 
        address, 
        lat, 
        lng,
        owner:users!owner_id (phone)
      ),
      customer:users!customer_id (full_name, phone)
    `)
    .eq('rider_id', user.id)
    .in('status', ['picking_up', 'delivering'])
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function acceptDelivery(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Fetch customer_id and restaurant details
  const { data: orderData } = await supabase
    .from('orders')
    .select('customer_id, restaurants (name)')
    .eq('id', orderId)
    .single()

  const { error } = await supabase
    .from('orders')
    .update({ rider_id: user.id, status: 'picking_up' })
    .eq('id', orderId)
    .eq('status', 'ready')

  if (error) return { error: error.message }

  if (orderData) {
    const restaurantName = (orderData.restaurants as any)?.name || 'ร้านค้า'
    
    // Notify Customer
    await createSystemNotification(
      orderData.customer_id,
      'ไรเดอร์รับออเดอร์แล้ว! 🚴',
      `ไรเดอร์สุดสุภาพได้รับงานแล้ว และกำลังเดินทางไปรับอาหารรสเด็ดของคุณที่ร้าน "${restaurantName}"`,
      'order',
      { orderId }
    )

    // Notify Rider
    await createSystemNotification(
      user.id,
      'รับงานจัดส่งสำเร็จ! 👍',
      `คุณได้รับสิทธิ์จัดส่งอาหารจากร้าน "${restaurantName}" เรียบร้อยแล้ว กรุณามุ่งหน้าเดินทาง`,
      'order',
      { orderId }
    )
  }

  revalidatePath('/rider')
  return { success: true }
}

export async function getMyEarnings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (name),
      users!customer_id (full_name)
    `)
    .eq('rider_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: 'pending' | 'paid' | 'failed') {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/restaurant')
  revalidatePath('/rider')
  revalidatePath('/customer')
  return { success: true }
}

// Proactive Fix: Solve the Rider Lock-in defect. Allow riders to release jobs back to the pool in case of emergencies.
export async function cancelDeliveryByRider(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Fetch order data to get customer_id for notification
  const { data: orderData } = await supabase
    .from('orders')
    .select('customer_id, restaurants (name)')
    .eq('id', orderId)
    .single()

  const { error } = await supabase
    .from('orders')
    .update({ 
      rider_id: null, 
      status: 'ready' // Revert status to 'ready' so other riders can accept it in the Job Pool
    })
    .eq('id', orderId)
    .eq('rider_id', user.id)

  if (error) return { error: error.message }

  if (orderData) {
    const restaurantName = (orderData.restaurants as any)?.name || 'ร้านค้า'
    // Notify Customer about dispatch delay/change
    await createSystemNotification(
      orderData.customer_id,
      'กำลังจัดหาไรเดอร์ท่านใหม่ 🚴',
      `ไรเดอร์ท่านเดิมเกิดเหตุสุดวิสัย ระบบกำลังเร่งจัดหาคนขับคนใหม่เพื่อไปรับอาหารของคุณที่ร้าน "${restaurantName}"`,
      'order',
      { orderId }
    )
  }

  revalidatePath('/rider')
  revalidatePath('/customer')
  return { success: true }
}
