export const dynamic = "force-dynamic";

import { getRiderHistory } from "@/app/actions/rider"
import { MapPin, CheckCircle, XCircle } from "lucide-react"

export default async function RiderHistoryPage() {
  const { data: history } = await getRiderHistory()

  const completedOrders = history?.filter(o => o.status === 'completed') || []
  
  // Calculate total earnings (delivery_fee)
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.delivery_fee || 0), 0)

  return (
    <div className="space-y-0 relative min-h-screen bg-[#1c1c1e]">
      {/* Header */}
      <div className="bg-[#2c2c2e] px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Earnings & History</p>
            <h2 className="text-white font-bold text-xl">ประวัติและรายได้</h2>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Earnings Card */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#ffd709] p-4 rounded-3xl text-[#1c1c1e]">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">รายได้รวม</p>
            <h3 className="font-black text-2xl">฿{totalEarnings}</h3>
          </div>
          <div className="bg-[#2c2c2e] p-4 rounded-3xl text-white border border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">งานสำเร็จ</p>
            <h3 className="font-black text-2xl">{completedOrders.length} <span className="text-sm font-normal text-gray-500">รอบ</span></h3>
          </div>
        </div>

        {/* History List */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">ประวัติการวิ่งงาน</h3>
          
          {(!history || history.length === 0) ? (
            <div className="text-center py-16 bg-[#2c2c2e] rounded-3xl border border-dashed border-gray-600">
              <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">history</span>
              <p className="text-gray-400">ยังไม่มีประวัติการวิ่งงาน</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((order: any) => {
                const dateObj = new Date(order.created_at)
                const dateStr = dateObj.toLocaleDateString('th-TH', { 
                  month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })
                const isCompleted = order.status === 'completed'

                return (
                  <div key={order.id} className="bg-[#2c2c2e] rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 w-fit ${isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {isCompleted ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCompleted ? 'สำเร็จ' : 'ยกเลิก'}
                        </span>
                        <p className="text-gray-400 text-xs mt-2">{dateStr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">ค่าจัดส่ง</p>
                        <p className="text-white font-bold text-lg">฿{order.delivery_fee}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ffd709] mt-1.5 flex-shrink-0"></div>
                        <p className="text-sm text-gray-300 line-clamp-1">{order.restaurants?.name}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                        <p className="text-sm text-gray-300 line-clamp-1">{order.customer?.full_name || '-'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
