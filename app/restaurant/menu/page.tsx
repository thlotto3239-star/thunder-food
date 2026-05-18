export const dynamic = "force-dynamic";

import { getMenuCategories, getMenuItems } from '@/app/actions/menu'
import MenuManager from './MenuManager'

export default async function RestaurantMenuPage() {
  const [categoriesRes, itemsRes] = await Promise.all([
    getMenuCategories(),
    getMenuItems()
  ])

  if (categoriesRes.error === 'Restaurant not found') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto p-8 text-center bg-[#ffffff] rounded-[2.5rem] shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-gray-100 font-thai">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#ffd709] to-[#ffe564] rounded-[2rem] flex items-center justify-center shadow-lg transform rotate-6 animate-pulse">
            <span className="material-symbols-outlined text-4xl text-[#5b4b00]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0e0e0e] rounded-full flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[12px] text-[#ffd709]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
        </div>

        <h2 className="font-headline text-3xl font-black text-gray-900 tracking-tight mb-3">กรุณาตั้งค่าข้อมูลร้านค้าของคุณก่อน ⚡</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
          เพื่อเริ่มจัดการเมนูอาหารและหมวดหมู่อาหาร กรุณากรอกรายละเอียดข้อมูลพื้นฐานของร้านค้าคุณก่อนเป็นอันดับแรก
        </p>

        <a 
          href="/restaurant/settings" 
          className="inline-flex items-center gap-2 bg-[#0e0e0e] text-[#ffd709] hover:bg-gray-800 transition-all duration-300 font-bold px-8 py-4 rounded-2xl shadow-md hover:shadow-xl active:scale-95 text-sm"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          ตั้งค่าข้อมูลร้านค้าของคุณ
        </a>
      </div>
    )
  }

  const categories = categoriesRes.data || []
  const items = itemsRes.data || []

  return (
    <div className="space-y-6">
      <div>
        <p className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">Menu Management</p>
        <h2 className="font-headline text-3xl font-black tracking-tight font-thai">จัดการเมนูอาหาร</h2>
        <p className="text-[#5c5b5b] font-thai text-sm mt-2">เพิ่ม ลบ แก้ไข รายการอาหารและหมวดหมู่ของร้านคุณ</p>
      </div>

      <MenuManager initialCategories={categories} initialItems={items} />
    </div>
  )
}
