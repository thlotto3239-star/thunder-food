'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  if (!phone || !password) {
    return { error: 'กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน' }
  }

  const supabase = await createClient()
  const email = `${phone.toLowerCase()}@thunder-food.com`

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password,
  })

  if (error) {
    return { error: 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง' }
  }

  if (!data || !data.user) {
    return { error: 'ไม่พบข้อมูลผู้ใช้งานในระบบ' }
  }

  // Determine redirect based on role securely from the database
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()
  const role = profile?.role || data.user.user_metadata?.role || 'customer'
  
  revalidatePath('/', 'layout')
  return { success: true, role }
}

export async function register(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'customer' | 'restaurant' | 'rider'

  if (!fullName || !phone || !password || !role) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }
  }

  if (password.length < 6) {
    return { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
  }

  const supabase = await createClient()
  const email = `${phone.toLowerCase()}@thunder-food.com`

  const { data, error } = await supabase.auth.signUp({
    email,
    password: password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'เบอร์โทรศัพท์นี้ถูกใช้งานในระบบแล้ว' }
    }
    if (error.status === 429) {
      return { error: 'ระบบส่งอีเมลจำกัดจำนวนครั้ง โปรดแจ้ง Admin ให้ปิด Confirm Email ในหน้า Supabase Dashboard' }
    }
    return { error: error.message }
  }

  if (!data || !data.user) {
    return { error: 'ไม่สามารถลงทะเบียนบัญชีผู้ใช้งานได้' }
  }

  // Immediately sign in to set cookies and create session
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: password,
  })

  if (signInError) {
    return { error: 'สมัครสมาชิกสำเร็จ แต่เข้าสู่ระบบอัตโนมัติล้มเหลว กรุณาล็อกอินใหม่' }
  }

  // A-01: Automatically Analyze role and seed all necessary default tables to ensure the user has full operational data immediately.
  try {
    // 1. Safety Profile Upsert in public.users
    await supabase.from('users').upsert({
      id: data.user.id,
      role: role,
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString()
    })

    // 2. Role-specific Seeding
    if (role === 'customer') {
      // Seed default address
      await supabase.from('user_addresses').insert({
        user_id: data.user.id,
        title: 'บ้าน (ค่าเริ่มต้น) 🏡',
        address: '123/45 คอนโดแลนด์มาร์ค อารีย์ ชั้น 14 ซอยพหลโยธิน 7 แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
        is_default: true
      })

      // Seed default payment method
      await supabase.from('user_payment_methods').insert({
        user_id: data.user.id,
        provider: 'promptpay',
        is_default: true
      })

      // Welcome notification
      await supabase.from('notifications').insert({
        user_id: data.user.id,
        title: 'ยินดีต้อนรับสู่ Thunder Food! ⚡',
        body: 'ขอบคุณที่ร่วมเป็นส่วนหนึ่งของครอบครัวอาหารด่วนสายฟ้า เราพร้อมจัดส่งเมนูอร่อยถึงมือคุณในเวลาอันรวดเร็ว!',
        type: 'system',
        is_read: false
      })

    } else if (role === 'rider') {
      // Seed rider profile
      await supabase.from('rider_profiles').insert({
        id: data.user.id,
        vehicle_info: 'Honda Wave 110i สีแดง-ดำ',
        license_plate: '1กข 7777 กรุงเทพมหานคร',
        is_online: true,
        total_earnings: 0
      })

      // Welcome notification
      await supabase.from('notifications').insert({
        user_id: data.user.id,
        title: 'พร้อมรับงานแล้ว ไรเดอร์สายฟ้า! 🚴',
        body: 'โปรไฟล์ไรเดอร์ของคุณพร้อมทำงานแล้ว ระบบเปิดสถานะออนไลน์ให้คุณเป็นที่เรียบร้อย เริ่มต้นสร้างรายได้กันเลย!',
        type: 'system',
        is_read: false
      })

    } else if (role === 'restaurant') {
      // Seed restaurant profile
      const { data: restaurant } = await supabase
        .from('restaurants')
        .insert({
          owner_id: data.user.id,
          name: `ร้านอร่อยเด็ดสายฟ้า ของ ${fullName} ⚡`,
          description: 'อาหารรสเลิศ ปรุงร้อน สดใหม่ สะอาด ถูกหลักอนามัย พร้อมเสิร์ฟความอร่อยด่วนสายฟ้า',
          image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
          address: '456 ซอยสุขุมวิท 23 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
          lat: 13.736717,
          lng: 100.560416,
          is_open: true,
          is_verified: true
        })
        .select('id')
        .single()

      if (restaurant) {
        // Seed categories
        const { data: cat1 } = await supabase
          .from('menu_categories')
          .insert({
            restaurant_id: restaurant.id,
            name: 'เมนูแนะนำยอดนิยม 🌟',
            sort_order: 1
          })
          .select('id')
          .single()

        const { data: cat2 } = await supabase
          .from('menu_categories')
          .insert({
            restaurant_id: restaurant.id,
            name: 'เครื่องดื่มชื่นใจ 🍹',
            sort_order: 2
          })
          .select('id')
          .single()

        // Seed menu items
        if (cat1) {
          await supabase.from('menu_items').insert([
            {
              restaurant_id: restaurant.id,
              category_id: cat1.id,
              name: 'กะเพราเนื้อสับไข่ดาวกรอบ',
              description: 'ผัดแห้ง รสจัดจ้าน เสิร์ฟพร้อมไข่ดาวขอบกรอบไข่แดงเยิ้ม',
              price: 89,
              image_url: 'https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?auto=format&fit=crop&q=80&w=400',
              is_available: true
            },
            {
              restaurant_id: restaurant.id,
              category_id: cat1.id,
              name: 'ผัดไทยกุ้งสดโบราณ',
              description: 'ผัดไทยสูตรมะขามเปียกโบราณ รสเข้มข้นกลมกล่อม',
              price: 119,
              image_url: 'https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?auto=format&fit=crop&q=80&w=400',
              is_available: true
            }
          ])
        }

        if (cat2) {
          await supabase.from('menu_items').insert([
            {
              restaurant_id: restaurant.id,
              category_id: cat2.id,
              name: 'ชานมไข่มุกพรีเมียม',
              description: 'ชาไต้หวันแท้ กลิ่นหอมใบชาต้มสด หวานน้อย ไข่มุกเคี้ยวหนึบ',
              price: 65,
              image_url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
              is_available: true
            },
            {
              restaurant_id: restaurant.id,
              category_id: cat2.id,
              name: 'น้ำเก๊กฮวยสูตรต้มสด',
              description: 'หอมเก๊กฮวยแท้ ดับร้อนแก้กระหาย หวานเย็นชื่นใจ',
              price: 35,
              image_url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
              is_available: true
            }
          ])
        }
      }

      // Welcome notification
      await supabase.from('notifications').insert({
        user_id: data.user.id,
        title: 'ร้านค้าของคุณเปิดให้บริการแล้ว! 🍳',
        body: 'ร้านอาหารของคุณพร้อมรับออเดอร์แล้ว ระบบได้สร้างเมนูแนะนำตัวอย่างให้คุณแล้ว 4 รายการ คุณสามารถแก้ไขหรือเพิ่มเติมได้ทันที!',
        type: 'system',
        is_read: false
      })
    }
  } catch (err) {
    console.error('Error seeding registration demo data:', err)
  }

  revalidatePath('/', 'layout')
  if (role === 'customer') {
    redirect('/')
  } else {
    redirect(`/${role}`)
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
