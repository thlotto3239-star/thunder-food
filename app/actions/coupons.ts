'use server'

import { createClient } from '@/utils/supabase/server'

export async function validateCoupon(code: string, orderAmount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อนใช้รหัสส่วนลด' }

  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode) return { error: 'กรุณากรอกรหัสส่วนลด' }

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', normalizedCode)
    .eq('is_active', true)
    .single()

  if (error || !coupon) return { error: 'ไม่พบรหัสส่วนลดนี้ หรือถูกปิดใช้งานแล้ว' }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { error: 'รหัสส่วนลดนี้หมดอายุแล้ว' }
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { error: 'รหัสส่วนลดนี้ถูกใช้ครบจำนวนสิทธิ์แล้ว' }
  }

  if (orderAmount < coupon.min_order_amount) {
    return { error: `ยอดสั่งซื้อขั้นต่ำสำหรับรหัสนี้คือ ${coupon.min_order_amount} บาท` }
  }

  const rawDiscount = coupon.discount_type === 'percent'
    ? Math.round(orderAmount * (coupon.discount_value / 100))
    : coupon.discount_value

  const discount = Math.min(rawDiscount, orderAmount)

  return { success: true, discount, couponId: coupon.id as string, code: coupon.code as string }
}
