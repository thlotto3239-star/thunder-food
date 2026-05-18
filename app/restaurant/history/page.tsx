export const dynamic = "force-dynamic";

import { getRestaurantHistoryOrders } from "@/app/actions/order"

const statusMap: Record<string, string> = {
  ready: "รอไรเดอร์รับอาหาร",
  picking_up: "ไรเดอร์กำลังมารับ",
  delivering: "กำลังจัดส่ง",
  completed: "สำเร็จ",
  cancelled: "ยกเลิกแล้ว",
}

const statusColors: Record<string, string> = {
  ready: "bg-blue-100 text-blue-600",
  picking_up: "bg-blue-100 text-blue-600",
  delivering: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
}

export default async function RestaurantHistoryPage() {
  const { data: orders, error } = await getRestaurantHistoryOrders()
  
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

        <h2 className="font-headline text-3xl font-black text-gray-900 tracking-tight mb-3">กรุณาตั้งค่าข้อมูลร้านค้าของคุณก่อน ⚡</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
          เพื่อดูยอดขายรวมและประวัติออเดอร์ย้อนหลัง กรุณากรอกรายละเอียดข้อมูลพื้นฐานของร้านค้าคุณก่อนเป็นอันดับแรก
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

  const totalRevenue = orders
    ?.filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

  const completedCount = orders?.filter(o => o.status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">Order History</p>
        <h2 className="font-headline text-3xl font-black tracking-tight font-thai">ประวัติและรายได้</h2>
        <p className="text-[#5c5b5b] font-thai text-sm mt-2">ตรวจสอบออเดอร์ที่ดำเนินการแล้ว และยอดขายรวม</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0e0e0e] text-[#ffd709] p-6 rounded-3xl shadow-lg">
          <p className="font-label text-xs font-bold uppercase tracking-widest opacity-80 mb-2">ยอดขายรวม (สำเร็จ)</p>
          <h3 className="font-headline font-black text-3xl">฿{totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-[#ffffff] text-[#0e0e0e] p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          <p className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] mb-2">ออเดอร์สำเร็จ</p>
          <h3 className="font-headline font-black text-3xl">{completedCount} <span className="text-lg text-[#afadac]">รายการ</span></h3>
        </div>
      </div>

      <div className="bg-[#ffffff] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="font-headline font-black text-xl mb-4">รายการย้อนหลัง</h3>
        
        {(!orders || orders.length === 0) ? (
          <p className="text-center text-[#afadac] py-8">ไม่มีประวัติคำสั่งซื้อ</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const dateObj = new Date(order.created_at);
              const dateStr = dateObj.toLocaleDateString('th-TH', { 
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={order.id} className="border border-[#f3f0ef] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#0e0e0e]">ออเดอร์ #{order.id.substring(0,6).toUpperCase()}</h4>
                      <p className="text-xs text-[#5c5b5b]">{dateStr}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusMap[order.status] || order.status}
                    </span>
                  </div>
                  
                  <div className="bg-[#f9f6f5] p-3 rounded-xl">
                    <p className="text-sm font-medium text-[#2f2f2e] mb-2">ลูกค้า: {order.customer?.full_name || order.users?.full_name || 'ลูกค้า'}</p>
                    <ul className="text-xs text-[#5c5b5b] space-y-1">
                      {order.order_items?.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.menu_items?.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#f3f0ef]">
                    <span className="text-sm font-bold text-[#5c5b5b]">ยอดรวม</span>
                    <span className="font-black text-[#0e0e0e]">฿{order.total_amount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
