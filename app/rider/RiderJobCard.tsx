'use client'

import { useState } from 'react'
import { acceptDelivery, updateOrderStatus } from '@/app/actions/order'
import { useToast } from '@/components/ui/use-toast'

export default function RiderJobCard({ order, isMyJob }: { order: any, isMyJob: boolean }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleAccept() {
    setIsLoading(true)
    const res = await acceptDelivery(order.id)
    if (res.error) toast({ title: 'Error', description: res.error, variant: 'destructive' })
    else toast({ title: 'รับงานสำเร็จ!' })
    setIsLoading(false)
  }

  async function handleUpdateStatus(status: "pending" | "preparing" | "ready" | "picking_up" | "delivering" | "completed" | "cancelled") {
    setIsLoading(true)
    const res = await updateOrderStatus(order.id, status)
    if (res.error) toast({ title: 'Error', description: res.error, variant: 'destructive' })
    else toast({ title: 'อัปเดตสถานะสำเร็จ' })
    setIsLoading(false)
  }

  return (
    <div className="bg-[#2c2c2e] rounded-3xl p-5 relative overflow-hidden border border-white/5">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h4 className="text-xl font-bold text-white mb-1">ค่าจัดส่ง ฿{order.delivery_fee}</h4>
          <p className="text-gray-400 text-sm">ออเดอร์ #{order.id.substring(0,6).toUpperCase()}</p>
        </div>
        <div className="bg-[#1c1c1e] text-[#ffd709] px-3 py-1 rounded-full text-xs font-bold border border-[#ffd709]/20">
          {order.status === 'ready' ? 'พร้อมรับ' : order.status === 'picking_up' ? 'กำลังไปรับ' : 'กำลังจัดส่ง'}
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        {/* Pickup */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-[#ffd709]"></div>
            <div className="w-0.5 h-full bg-gray-700 my-1"></div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">รับอาหารที่</p>
            <p className="text-white font-medium">{order.restaurants?.name}</p>
            <p className="text-gray-400 text-sm line-clamp-1">{order.restaurants?.address || 'ไม่มีที่อยู่'}</p>
          </div>
        </div>
        
        {/* Dropoff */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">ส่งที่</p>
            <p className="text-white font-medium">{order.customer?.full_name || (order as any)['users!customer_id']?.full_name || order.users?.full_name || 'ลูกค้า'}</p>
            <p className="text-gray-400 text-sm line-clamp-2">{order.delivery_address?.address || 'ลูกค้าไม่ได้ระบุที่อยู่'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700 relative z-10">
        {!isMyJob ? (
          <button 
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full bg-[#ffd709] text-[#1c1c1e] font-bold text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
          >
            {isLoading ? 'กำลังรับงาน...' : 'รับงานนี้'}
          </button>
        ) : (
          <div className="flex gap-3">
            {order.status === 'picking_up' && (
              <button 
                onClick={() => handleUpdateStatus('delivering')}
                disabled={isLoading}
                className="flex-1 bg-[#ffd709] text-[#1c1c1e] font-bold py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                รับอาหารแล้ว
              </button>
            )}
            {order.status === 'delivering' && (
              <button 
                onClick={() => handleUpdateStatus('completed')}
                disabled={isLoading}
                className="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                จัดส่งสำเร็จ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
