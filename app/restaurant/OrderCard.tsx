'use client'

import { useState } from 'react'
import { updateOrderStatus, updatePaymentStatus } from '@/app/actions/order'
import { useToast } from '@/components/ui/use-toast'

export default function OrderCard({ order }: { order: any }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSlipModal, setShowSlipModal] = useState(false)
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)

  const isPending = order.status === 'pending'
  const isTransfer = order.payment_method === 'transfer'

  async function handleStatusUpdate(newStatus: "pending" | "preparing" | "ready" | "picking_up" | "delivering" | "completed" | "cancelled") {
    setIsLoading(true)
    const res = await updateOrderStatus(order.id, newStatus)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'อัปเดตสถานะออเดอร์สำเร็จ' })
    }
    setIsLoading(false)
  }

  async function handlePaymentStatusUpdate(newPaymentStatus: 'pending' | 'paid' | 'failed') {
    setIsUpdatingPayment(true)
    const res = await updatePaymentStatus(order.id, newPaymentStatus)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'อัปเดตสถานะการชำระเงินสำเร็จ' })
      if (newPaymentStatus === 'paid' && order.status === 'pending') {
        // Automatically start preparing the order
        await handleStatusUpdate('preparing')
      }
    }
    setIsUpdatingPayment(false)
    setShowSlipModal(false)
  }

  const timeAgo = Math.floor((new Date().getTime() - new Date(order.created_at).getTime()) / 60000)

  return (
    <div className="bg-[#ffffff] rounded-[2rem] p-6 space-y-4 relative shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#e4e2e1] flex items-center justify-center text-[#5c5b5b]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h4 className="font-thai font-bold text-lg leading-tight">{order.customer?.full_name || order.users?.full_name || 'ลูกค้า'}</h4>
            <p className="font-label text-xs text-[#5c5b5b]">#ORD-{order.id.substring(0,6).toUpperCase()} • {timeAgo} นาทีที่แล้ว</p>
          </div>
        </div>
        {isPending && <div className="bg-[#b02500] text-[#ffefec] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">New</div>}
      </div>

      {/* Payment details and actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-1.5 font-thai">
          <span className="material-symbols-outlined text-gray-400 text-sm">payments</span>
          <span className="text-xs text-gray-500 font-medium">การชำระเงิน:</span>
          {isTransfer ? (
            <>
              {order.payment_status === 'paid' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  โอนเงินสำเร็จ
                </span>
              ) : order.payment_status === 'failed' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  สลิปไม่ถูกต้อง
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  รอตรวจสอบสลิป
                </span>
              )}
            </>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              ชำระเงินปลายทาง (COD)
            </span>
          )}
        </div>

        {isTransfer && order.payment_slip_url && (
          <button
            onClick={() => setShowSlipModal(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#6c5a00] hover:text-[#ffd709] bg-yellow-50 hover:bg-yellow-100/50 px-2.5 py-1 rounded-xl transition-all font-thai active:scale-95 border border-yellow-100"
          >
            <span className="material-symbols-outlined text-xs">receipt_long</span>
            ดูสลิปโอนเงิน
          </button>
        )}
      </div>

      <div className="bg-[#f3f0ef] rounded-2xl p-4 space-y-2">
        {order.order_items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between font-thai text-sm text-[#2f2f2e]">
            <span>{item.menu_items?.name}</span>
            <span className="font-bold">x{item.quantity}</span>
          </div>
        ))}
        {order.delivery_address?.note && (
          <div className="mt-2 pt-2 border-t border-[#dfdcdc]/50 text-xs font-thai text-gray-500">
            <span className="font-bold text-gray-700">หมายเหตุ:</span> {order.delivery_address.note}
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-[#dfdcdc] flex justify-between font-bold font-thai">
          <span>ยอดรวม</span>
          <span className="text-[#6c5a00]">฿{order.total_amount}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => handleStatusUpdate('preparing')}
          disabled={isLoading || !isPending || (isTransfer && order.payment_status !== 'paid')}
          className={`py-4 rounded-xl font-thai font-bold text-sm transition-all active:scale-95 ${
            isPending && (!isTransfer || order.payment_status === 'paid')
              ? 'bg-[#e4e2e1] hover:bg-[#dfdcdc] text-[#2f2f2e]' 
              : 'bg-[#f3f0ef] text-[#afadac] cursor-not-allowed'
          }`}
          title={isTransfer && order.payment_status !== 'paid' ? 'กรุณาอนุมัติสลิปโอนเงินก่อนเตรียมอาหาร' : ''}
        >
          {isTransfer && order.payment_status !== 'paid' ? 'รออนุมัติสลิป' : 'เริ่มเตรียม'}
        </button>
        <button 
          onClick={() => handleStatusUpdate('ready')}
          disabled={isLoading || isPending}
          className={`py-4 rounded-xl font-thai font-bold text-sm active:scale-95 transition-transform ${!isPending ? 'bg-gradient-to-br from-[#6c5a00] to-[#ffd709] text-[#000000] shadow-lg' : 'bg-[#f3f0ef] text-[#afadac] cursor-not-allowed'}`}
        >
          พร้อมส่ง
        </button>
      </div>

      {/* Premium Glassmorphic Slip Viewer Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div 
            className="bg-white rounded-[2.5rem] overflow-hidden max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="font-thai">
                <h3 className="font-bold text-gray-900">ตรวจสอบสลิปโอนเงิน</h3>
                <p className="text-xs text-gray-500 mt-0.5">ยอดรวมของออเดอร์: ฿{order.total_amount}</p>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors active:scale-90"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Content - Slip Image */}
            <div className="p-4 flex-1 overflow-y-auto bg-gray-100 flex items-center justify-center min-h-[300px]">
              <img
                src={order.payment_slip_url}
                alt="Payment Slip"
                className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-md bg-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-gray-100 space-y-3 bg-white font-thai">
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={isUpdatingPayment}
                  onClick={() => handlePaymentStatusUpdate('failed')}
                  className="py-3 rounded-xl border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  สลิปไม่ถูกต้อง
                </button>
                <button
                  disabled={isUpdatingPayment}
                  onClick={() => handlePaymentStatusUpdate('paid')}
                  className="py-3 rounded-xl bg-gradient-to-br from-[#6c5a00] to-[#ffd709] hover:brightness-105 text-black font-bold text-xs shadow-md shadow-yellow-500/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  ยืนยันยอดเงิน
                </button>
              </div>
              
              <button
                onClick={() => setShowSlipModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-bold transition-colors active:scale-95"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
