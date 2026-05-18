export const dynamic = "force-dynamic";

import { createClient } from '@/utils/supabase/server'

const statusColors: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-800',
  preparing:  'bg-blue-100 text-blue-800',
  ready:      'bg-green-100 text-green-800',
  picking_up: 'bg-purple-100 text-purple-800',
  delivering: 'bg-indigo-100 text-indigo-800',
  completed:  'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-100 text-red-700',
}
const statusLabels: Record<string, string> = {
  pending: 'รอยืนยัน', preparing: 'กำลังทำ', ready: 'พร้อมส่ง',
  picking_up: 'ไรเดอร์รับแล้ว', delivering: 'กำลังจัดส่ง', completed: 'เสร็จสิ้น', cancelled: 'ยกเลิก',
}

export default async function AdminOrdersPage() {
  // BUG-AO01 Fixed: Use direct Supabase client with aliased joins instead of getAllOrders action
  // because Supabase doesn't support multiple relations to same table in single select without aliases
  const supabase = await createClient()
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      created_at,
      customer_id,
      restaurant_id,
      restaurants (name),
      customer:users!customer_id (full_name, phone)
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  const totalRevenue = orders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
  const completedCount = orders?.filter(o => o.status === 'completed').length || 0
  const pendingCount = orders?.filter(o => o.status === 'pending').length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black font-thai text-[#0e0e0e]">ประวัติคำสั่งซื้อทั้งหมด</h1>
        <p className="text-[#8c8a88] text-sm mt-1">ดูและติดตามออเดอร์ทั้งระบบ</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ออเดอร์ทั้งหมด', value: orders?.length || 0, color: 'text-[#ffd709]', bg: 'bg-[#ffd709]/10' },
          { label: 'เสร็จสิ้น', value: completedCount, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'รอยืนยัน', value: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'รายได้รวม', value: `฿${totalRevenue.toLocaleString()}`, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4`}>
            <p className="text-gray-500 text-xs font-thai">{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 font-thai">{error.message}</div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-thai">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">ลูกค้า</th>
                <th className="p-4 font-medium">ร้านอาหาร</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium">ยอดรวม</th>
                <th className="p-4 font-medium">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!orders || orders.length === 0) ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">ยังไม่มีคำสั่งซื้อในระบบ</td>
                </tr>
              ) : orders.map((order) => {
                const customer = order.customer as any
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{customer?.full_name || '-'}</p>
                      <p className="text-xs text-gray-400">{customer?.phone || ''}</p>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {(order.restaurants as any)?.name || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || ''}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">฿{order.total_amount?.toLocaleString() || 0}</td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
