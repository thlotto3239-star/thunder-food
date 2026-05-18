export const dynamic = "force-dynamic";

import { getRestaurantOrders } from '@/app/actions/order'
import OrderCard from './OrderCard'
import RealtimeListener from './RealtimeListener'
import { createClient } from '@/utils/supabase/server'

export default async function RestaurantDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let restaurantId = ''
  if (user) {
    const { data: rest } = await supabase.from('restaurants').select('id').eq('owner_id', user.id).single()
    if (rest) restaurantId = rest.id
  }

  const { data: orders, error } = await getRestaurantOrders()

  if (error) {
    if (error === 'Restaurant not found') {
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

          <h2 className="font-headline text-3xl font-black text-gray-900 tracking-tight mb-3">ยินดีต้อนรับสู่ Thunder Food! ⚡</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
            ยินดีต้อนรับพันธมิตรร้านค้าใหม่เข้าสู่ครอบครัวสายฟ้า! เพื่อเปิดใช้งานแดชบอร์ดรับออเดอร์และสร้างรายการเมนู กรุณากรอกข้อมูลและที่อยู่ของร้านคุณก่อนเริ่มต้น
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
    return <div className="p-6 text-[#b02500] font-thai bg-red-50 border border-red-100 rounded-2xl">เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์: {error}</div>
  }

  const activeOrders = orders || []
  
  // Calculate mock revenue or real revenue
  const totalRevenue = activeOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)

  return (
    <div className="space-y-6 relative">
      <RealtimeListener restaurantId={restaurantId} />
      
      {/* Dashboard Header & Stats Bento Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">Live Dashboard</p>
            <h2 className="font-headline text-3xl font-black tracking-tight font-thai">สรุปภาพรวมวันนี้</h2>
          </div>
          <div className="bg-[#eae7e7] px-3 py-1 rounded-full flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="font-label text-xs font-bold">Real-time</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Large Stat */}
          <div className="col-span-2 bg-[#0e0e0e] text-[#f9f6f5] rounded-[2rem] p-6 flex flex-col justify-between aspect-[2/1] relative overflow-hidden">
            <div className="z-10">
              <p className="font-thai text-[#ffd709] text-opacity-80 font-medium">รายได้จากออเดอร์ปัจจุบัน (บาท)</p>
              <p className="font-headline text-5xl font-black mt-2">฿{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-end z-10">
              <span className="bg-[#ffd709] text-[#5b4b00] font-bold px-3 py-1 rounded-full text-xs">Live</span>
              <span className="material-symbols-outlined text-[#ffd709] text-4xl">trending_up</span>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#6c5a00] opacity-50 rounded-full blur-3xl"></div>
          </div>
          
          {/* Small Stats */}
          <div className="bg-[#f3f0ef] p-5 rounded-[1.5rem] flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e4e2e1] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6c5a00]">package_2</span>
            </div>
            <div>
              <p className="font-thai text-sm text-[#5c5b5b]">ออเดอร์ค้าง</p>
              <p className="font-headline text-2xl font-extrabold">{activeOrders.length}</p>
            </div>
          </div>
          
          <div className="bg-[#f3f0ef] p-5 rounded-[1.5rem] flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e4e2e1] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6c5a00]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            </div>
            <div>
              <p className="font-thai text-sm text-[#5c5b5b]">รีวิวใหม่</p>
              <p className="font-headline text-2xl font-extrabold">-</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Orders Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold font-thai flex items-center gap-2">
            ออเดอร์ที่กำลังดำเนินการ
            {activeOrders.length > 0 && <span className="bg-[#f95630] text-[#ffefec] text-[10px] px-2 py-0.5 rounded-full">{activeOrders.length} ใหม่</span>}
          </h3>
        </div>
        
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-10 bg-[#ffffff] rounded-[2rem]">
              <span className="material-symbols-outlined text-4xl text-[#afadac] mb-2">inbox</span>
              <p className="text-[#5c5b5b] font-thai">ยังไม่มีออเดอร์ใหม่ในขณะนี้</p>
            </div>
          ) : (
            activeOrders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
