export const dynamic = "force-dynamic";

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Store,
  User,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderStatus } from "@/components/uglyos/order-status"
import { getOrderById } from "@/app/actions/order"
import OrderRealtimeListener from "./OrderRealtimeListener"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: orderData, error } = await getOrderById(id)

  if (error || !orderData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-xl font-bold mb-2">ไม่พบคำสั่งซื้อ</h1>
        <Link href="/">
          <Button>กลับสู่หน้าหลัก</Button>
        </Link>
      </div>
    )
  }

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(p)
  }

  // Calculate totals
  const subtotal = orderData.order_items.reduce((sum: number, item: any) => sum + (item.price_at_time * item.quantity), 0)
  const deliveryFee = orderData.delivery_fee || 0
  const total = subtotal + deliveryFee
  const deliveryAddress = orderData.delivery_address as any
  
  // Format Date
  const placedAt = new Date(orderData.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

  // Status mapping to Thai
  const statusMap: Record<string, string> = {
    pending: "รอร้านยืนยัน",
    preparing: "กำลังเตรียม",
    ready: "รอไรเดอร์มารับ",
    picking_up: "ไรเดอร์กำลังรับอาหาร",
    delivering: "กำลังจัดส่ง",
    completed: "จัดส่งสำเร็จ",
    cancelled: "ยกเลิกแล้ว"
  }

  return (
    <div className="min-h-screen bg-background pb-8 relative">
      <OrderRealtimeListener orderId={orderData.id} />
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
          <Link href="/">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-xl font-bold text-foreground truncate">ออเดอร์ {orderData.id.split('-')[0]}</h1>
            <p className="text-sm text-muted-foreground">สั่งเมื่อ {placedAt}</p>
          </div>
          <Badge className="bg-secondary text-secondary-foreground whitespace-nowrap">
            {statusMap[orderData.status] || orderData.status}
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Order Status */}
        <OrderStatus 
          status={orderData.status as any} 
          estimatedTime="15-25 นาที"
        />

        {/* Map Placeholder */}
        <Card className="my-4 overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-12 w-12 text-primary" />
                <p className="font-medium text-foreground">ติดตามการจัดส่ง</p>
                <p className="text-sm text-muted-foreground">แผนที่แบบเรียลไทม์ (จำลอง)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Rider Info (if assigned) */}
        {orderData.users && orderData.status !== "pending" && orderData.status !== "preparing" && orderData.status !== "ready" && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                  <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-2xl">two_wheeler</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{orderData.users.full_name || 'ไรเดอร์'}</p>
                  <p className="text-sm text-muted-foreground">
                    ผู้ขับขี่ Thunder Delivery
                  </p>
                </div>
                <div className="flex gap-2">
                  {orderData.users.phone ? (
                    <Button size="icon" variant="outline" asChild>
                      <a href={`tel:${orderData.users.phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button size="icon" variant="outline" disabled>
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restaurant Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{orderData.restaurants?.name}</p>
                <p className="text-sm text-muted-foreground">{orderData.restaurants?.address}</p>
              </div>
              {(orderData.restaurants as any)?.owner?.phone ? (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${(orderData.restaurants as any).owner.phone}`}>
                    <Phone className="mr-1 h-4 w-4" />
                    โทร
                  </a>
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  <Phone className="mr-1 h-4 w-4" />
                  โทร
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold text-foreground">ที่อยู่จัดส่ง</p>
                <p className="text-sm text-muted-foreground">{deliveryAddress?.address || (typeof deliveryAddress === 'string' ? deliveryAddress : '')}</p>
                {deliveryAddress?.note && (
                  <p className="text-sm text-muted-foreground mt-1">หมายเหตุ: {deliveryAddress.note}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">รายการสั่งซื้อ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orderData.order_items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span>
                    {item.menu_items.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price_at_time * item.quantity)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดรวมสินค้า</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>รวมทั้งหมด</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <Separator />
              <div className="space-y-2 pt-1 font-thai">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">ช่องทางชำระเงิน</span>
                  <span className="font-bold text-foreground">
                    {orderData.payment_method === 'transfer' ? 'พร้อมเพย์ / QR Code' : 'เงินสด (COD)'}
                  </span>
                </div>
                {orderData.payment_method === 'transfer' && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">สถานะชำระเงิน</span>
                    {orderData.payment_status === 'paid' ? (
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold">
                        ชำระเงินสำเร็จ
                      </Badge>
                    ) : orderData.payment_status === 'failed' ? (
                      <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-100 rounded-full text-[10px] font-bold">
                        สลิปไม่ถูกต้อง
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-100 rounded-full text-[10px] font-bold animate-pulse">
                        รอตรวจสอบสลิป
                      </Badge>
                    )}
                  </div>
                )}
                {orderData.payment_slip_url && (
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-50">
                    <span className="text-muted-foreground">หลักฐานการโอน</span>
                    <a
                      href={orderData.payment_slip_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[12px]">receipt_long</span>
                      ดูสลิปที่แนบไว้
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
