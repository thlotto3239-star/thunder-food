'use client'

import { useState } from 'react'
import { Clock, CheckCircle2, XCircle, UtensilsCrossed, Bike } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { updateOrderStatus } from '@/app/actions/order'
import { useToast } from '@/components/ui/use-toast'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'รอยืนยัน', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  preparing: { label: 'กำลังทำ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ready:     { label: 'พร้อมส่ง', color: 'bg-green-100 text-green-800 border-green-200' },
  picking_up: { label: 'ไรเดอร์รับแล้ว', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivering: { label: 'กำลังจัดส่ง', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700 border-red-200' },
}

function OrderCard({ order, onStatusChange }: { order: any; onStatusChange: (id: string, status: "pending" | "preparing" | "ready" | "picking_up" | "delivering" | "completed" | "cancelled") => void }) {
  const status = statusConfig[order.status] || statusConfig.pending
  const total = order.total_amount
  const customerName = order.users?.full_name || 'ลูกค้า'
  const customerPhone = order.users?.phone || '-'
  const orderTime = new Date(order.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  const orderDate = new Date(order.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{orderDate}</p>
            <p className="text-xs text-gray-500 font-medium">{orderTime}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1">
          {order.order_items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.menu_items?.name} <span className="text-gray-400">×{item.quantity}</span></span>
              <span className="font-medium">฿{(item.price_at_time * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between text-sm font-bold">
            <span>รวม</span>
            <span className="text-[#ffd709] text-base">฿{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm text-gray-800">{customerName}</p>
            <p className="text-xs text-gray-500">{customerPhone}</p>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <>
                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => onStatusChange(order.id, 'cancelled')}>
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-[#ffd709] text-[#0e0e0e] hover:bg-[#e5c108] font-bold"
                  onClick={() => onStatusChange(order.id, 'preparing')}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />รับออเดอร์
                </Button>
              </>
            )}
            {order.status === 'preparing' && (
              <Button size="sm" className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => onStatusChange(order.id, 'ready')}>
                <UtensilsCrossed className="h-4 w-4 mr-1" />พร้อมส่ง
              </Button>
            )}
            {order.status === 'ready' && (
              <Badge variant="outline" className="gap-1 text-blue-600 border-blue-200 bg-blue-50">
                <Bike className="h-3 w-3" />รอไรเดอร์
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RestaurantOrdersClient({ initialOrders, error }: { initialOrders: any[]; error?: string | null }) {
  const [orders, setOrders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState('active')
  const { toast } = useToast()

  const handleStatusChange = async (orderId: string, newStatus: "pending" | "preparing" | "ready" | "picking_up" | "delivering" | "completed" | "cancelled") => {
    const res = await updateOrderStatus(orderId, newStatus)
    if (res?.error) {
      toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      const labels: Record<string, string> = {
        preparing: 'รับออเดอร์แล้ว กำลังทำอาหาร',
        ready: 'อาหารพร้อมส่งแล้ว',
        cancelled: 'ยกเลิกออเดอร์แล้ว',
      }
      toast({ title: labels[newStatus] || 'อัปเดตสถานะแล้ว' })
    }
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 font-thai">เกิดข้อผิดพลาด: {error}</div>
  }

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status))
  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-headline text-[#0e0e0e]">จัดการออเดอร์</h2>
          <p className="text-sm text-gray-500 font-thai mt-1">ออเดอร์ทั้งหมดที่รอดำเนินการ</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            🔔 {pendingCount} ออเดอร์ใหม่!
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 rounded-2xl p-1">
          <TabsTrigger value="active" className="rounded-xl font-thai data-[state=active]:bg-white data-[state=active]:shadow-sm">
            กำลังดำเนินการ
            {pendingCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{pendingCount}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-xl font-thai data-[state=active]:bg-white data-[state=active]:shadow-sm">
            ทั้งหมด ({orders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
              <span className="text-5xl mb-4 block">✅</span>
              <p className="font-thai text-gray-500 text-lg">ไม่มีออเดอร์ที่รอดำเนินการ</p>
              <p className="text-gray-400 text-sm mt-1">ออเดอร์ใหม่จะแสดงที่นี่แบบ real-time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
              <p className="font-thai text-gray-500">ยังไม่มีออเดอร์</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
