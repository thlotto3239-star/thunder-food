"use client"

import { useState, useEffect } from "react"
import {
  Navigation,
  Phone,
  MessageSquare,
  CheckCircle2,
  Package,
  Store,
  User,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/uglyos/bottom-nav"
import { updateOrderStatus } from "@/app/actions/order"
import { useToast } from "@/components/ui/use-toast"

type DeliveryStage = "picking_up" | "delivering" | "completed"

const stageConfig = {
  picking_up: { 
    label: "กำลังไปรับอาหาร", 
    nextLabel: "รับอาหารแล้ว",
    nextState: "delivering",
    icon: <Store className="h-5 w-5" />,
    color: "bg-primary",
  },
  delivering: { 
    label: "กำลังไปส่ง", 
    nextLabel: "ส่งสำเร็จ",
    nextState: "completed",
    icon: <Navigation className="h-5 w-5" />,
    color: "bg-accent",
  },
  completed: { 
    label: "ส่งสำเร็จ", 
    nextLabel: "",
    nextState: null,
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "bg-green-600",
  },
}

export default function ActiveDeliveryClient({ initialOrders }: { initialOrders: any[] }) {
  const { toast } = useToast()
  // Always use the first active order for simplicity
  const [delivery, setDelivery] = useState(initialOrders[0] || null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const hasActiveDelivery = !!delivery && !showSuccess

  const advanceStage = async () => {
    if (!delivery) return
    setIsLoading(true)

    const currentConfig = stageConfig[delivery.status as DeliveryStage]
    if (currentConfig && currentConfig.nextState) {
      const res = await updateOrderStatus(delivery.id, currentConfig.nextState as any)
      if (res.error) {
        toast({ title: "Error", description: res.error, variant: "destructive" })
      } else {
        if (currentConfig.nextState === "completed") {
          setShowSuccess(true)
          setTimeout(() => setDelivery(null), 3000)
        } else {
          setDelivery({ ...delivery, status: currentConfig.nextState })
        }
      }
    }
    
    setIsLoading(false)
  }

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(p)
  }

  if (!hasActiveDelivery && !showSuccess) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <h1 className="text-xl font-bold text-foreground">งานปัจจุบัน</h1>
          </div>
        </header>
        <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16">
          <Navigation className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">ไม่มีงานที่กำลังดำเนินการ</h2>
          <p className="text-center text-muted-foreground">
            ไปที่หน้างานเพื่อรับงานใหม่
          </p>
          <Button className="mt-4 bg-primary text-primary-foreground" asChild>
            <a href="/rider">ดูงานที่รอรับ</a>
          </Button>
        </main>
        <BottomNav role="rider" />
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background pb-24">
         <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <h1 className="text-xl font-bold text-foreground">งานปัจจุบัน</h1>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-4 mt-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-green-600" />
              <h3 className="text-lg font-bold text-green-800">ส่งสำเร็จ!</h3>
              <p className="text-green-600">ขอบคุณที่ใช้บริการ Thunder Food</p>
              <p className="mt-2 text-2xl font-bold text-green-700">+{formatPrice(delivery.delivery_fee)}</p>
            </CardContent>
          </Card>
        </main>
        <BottomNav role="rider" />
      </div>
    )
  }

  const currentConfig = stageConfig[delivery.status as DeliveryStage] || stageConfig.picking_up

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">งานปัจจุบัน</h1>
              <p className="text-sm text-muted-foreground">#ORD-{delivery.id.substring(0, 6).toUpperCase()}</p>
            </div>
            <Badge className={`${currentConfig.color} text-white`}>
              {currentConfig.icon}
              <span className="ml-1">{currentConfig.label}</span>
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Current Destination */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              {delivery.status === "picking_up" ? (
                <Store className="h-5 w-5 text-primary" />
              ) : (
                <User className="h-5 w-5 text-accent" />
              )}
              <h3 className="font-semibold text-foreground">
                {delivery.status === "picking_up" ? "จุดรับอาหาร" : "จุดส่งอาหาร"}
              </h3>
            </div>
            
            {delivery.status === "picking_up" ? (
              <div className="space-y-2">
                <p className="font-medium text-foreground">{delivery.restaurants.name}</p>
                <p className="text-sm text-muted-foreground">{delivery.restaurants.address || "ไม่มีที่อยู่"}</p>
                <div className="flex gap-2">
                  {delivery.restaurants.owner?.phone ? (
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <a href={`tel:${delivery.restaurants.owner.phone}`}>
                        <Phone className="mr-1 h-4 w-4" />
                        โทร ({delivery.restaurants.owner.phone})
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled>
                      <Phone className="mr-1 h-4 w-4" />
                      โทร (ไม่มีเบอร์)
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-foreground">{delivery.customer?.full_name || "ไม่มีชื่อผู้รับ"}</p>
                <p className="text-sm text-muted-foreground">{delivery.delivery_address?.address || "ไม่มีที่อยู่"}</p>
                <div className="flex gap-2">
                  {delivery.customer?.phone ? (
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <a href={`tel:${delivery.customer.phone}`}>
                        <Phone className="mr-1 h-4 w-4" />
                        โทร ({delivery.customer.phone})
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled>
                      <Phone className="mr-1 h-4 w-4" />
                      โทร (ไม่มีเบอร์)
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="mb-3 font-semibold text-foreground">รายละเอียดออเดอร์</h3>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">ค่าจัดส่งที่จะได้รับ</span>
              <span className="text-lg font-bold text-green-600">{formatPrice(delivery.delivery_fee)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3 mt-3">
              <span className="text-muted-foreground">วิธีชำระเงินของลูกค้า</span>
              <span className="text-sm font-bold">{delivery.payment_method === 'cash' ? 'เงินสด' : 'โอนเงิน'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {currentConfig.nextLabel && (
          <Button 
            className="w-full bg-primary py-6 text-lg text-primary-foreground hover:bg-primary/90"
            onClick={advanceStage}
            disabled={isLoading}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {isLoading ? "กำลังอัปเดต..." : currentConfig.nextLabel}
          </Button>
        )}
      </main>

      <BottomNav role="rider" />
    </div>
  )
}
