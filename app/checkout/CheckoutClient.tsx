"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Wallet,
  QrCode,
  Clock,
  Check,
  Plus,
  Minus,
  Trash2,
  UploadCloud,
  X,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/components/thunder/cart-context"
import { createOrder } from "@/app/actions/order"
import { validateCoupon } from "@/app/actions/coupons"
import { useNotification } from "@/components/thunder/notification-popup"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

const paymentMethods = [
  { id: "promptpay", label: "พร้อมเพย์ / QR Code", icon: <QrCode className="h-5 w-5" /> },
  { id: "cod", label: "เงินสด (COD)", icon: <Wallet className="h-5 w-5" /> },
  { id: "card", label: "บัตรเครดิต / เดบิต", icon: <CreditCard className="h-5 w-5" /> },
]

export default function CheckoutClient({ addresses, payments }: { addresses: any[], payments: any[] }) {
  const router = useRouter()
  const { items, restaurantId, restaurantName, clearCart, updateQuantity, removeItem } = useCart()
  const { showNotification } = useNotification()
  
  const [selectedAddress, setSelectedAddress] = useState(addresses.length > 0 ? addresses.find(a => a.is_default)?.id || addresses[0].id : null)
  
  const defaultPayment = payments?.find(p => p.is_default)?.provider || "promptpay"
  const [selectedPayment, setSelectedPayment] = useState(defaultPayment)
  
  const [promoCode, setPromoCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ couponId: string; code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState("")
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false)
  const [note, setNote] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Item customization options state
  const [itemCustomizations, setItemCustomizations] = useState<Record<string, { noVeg: boolean; spicyLevel: string; extra: boolean; utensils: boolean }>>({})

  // PromptPay Slip states
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [isUploadingSlip, setIsUploadingSlip] = useState(false)

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(p)
  }

  // Calculate dynamic subtotal based on base price + dynamic options selected
  const subtotal = items.reduce((sum, item) => {
    const custom = itemCustomizations[item.id] || { noVeg: false, spicyLevel: "normal", extra: false, utensils: false }
    const extraCharge = custom.extra ? 15 : 0
    return sum + (item.price + extraCharge) * item.quantity
  }, 0)

  const deliveryFee = 25
  const discount = appliedCoupon?.discount || 0
  const total = subtotal + deliveryFee - discount

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return
    setIsCheckingCoupon(true)
    setCouponError("")
    const result = await validateCoupon(promoCode, subtotal + deliveryFee)
    if (result.error) {
      setCouponError(result.error)
      setAppliedCoupon(null)
    } else if (result.success) {
      setAppliedCoupon({ couponId: result.couponId!, code: result.code!, discount: result.discount! })
      setCouponError("")
    }
    setIsCheckingCoupon(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showNotification({ type: 'error', title: 'ประเภทไฟล์ไม่ถูกต้อง', message: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification({ type: 'error', title: 'ไฟล์มีขนาดใหญ่เกินไป', message: 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB' })
      return
    }

    setSlipFile(file)
    setSlipPreview(URL.createObjectURL(file))
  }

  const handleClearFile = () => {
    setSlipFile(null)
    setSlipPreview(null)
  }

  const toggleCustomization = (itemId: string, field: "noVeg" | "extra" | "utensils") => {
    setItemCustomizations(prev => {
      const current = prev[itemId] || { noVeg: false, spicyLevel: "normal", extra: false, utensils: false }
      return {
        ...prev,
        [itemId]: {
          ...current,
          [field]: !current[field]
        }
      }
    })
  }

  const changeSpicyLevel = (itemId: string, level: string) => {
    setItemCustomizations(prev => {
      const current = prev[itemId] || { noVeg: false, spicyLevel: "normal", extra: false, utensils: false }
      return {
        ...prev,
        [itemId]: {
          ...current,
          spicyLevel: level
        }
      }
    })
  }

  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) {
      showNotification({ type: 'error', title: 'ตะกร้าว่างเปล่า', message: 'กรุณาเลือกอาหารลงตะกร้าก่อนดำเนินการชำระเงิน' })
      return
    }

    if (!selectedAddress) {
      showNotification({ type: 'error', title: 'กรุณาเลือกที่อยู่จัดส่ง', message: 'ระบบยังไม่ทราบพิกัดจัดส่งอาหารของคุณ' })
      return
    }
    
    setIsProcessing(true)

    // Handle bank slip upload if PromptPay is selected
    let paymentSlipUrl = ""
    if (selectedPayment === "promptpay") {
      if (!slipFile) {
        showNotification({ type: 'error', title: 'กรุณาแนบสลิปการโอนเงิน', message: 'กรุณาโอนเงินผ่าน QR Code และแนบรูปภาพสลิปเพื่อทำรายการสั่งซื้อ' })
        setIsProcessing(false)
        return
      }

      setIsUploadingSlip(true)
      try {
        const supabase = createClient()
        const fileExt = slipFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('slips')
          .upload(filePath, slipFile)

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('slips')
          .getPublicUrl(filePath)
          
        paymentSlipUrl = publicUrl
      } catch (uploadErr: any) {
        showNotification({ 
          type: 'error',
          title: "อัปโหลดสลิปไม่สำเร็จ", 
          message: uploadErr.message || "กรุณาลองใหม่อีกครั้ง"
        })
        setIsUploadingSlip(false)
        setIsProcessing(false)
        return
      } finally {
        setIsUploadingSlip(false)
      }
    }
    
    const deliveryAddressObj = addresses.find(a => a.id === selectedAddress)
    
    // Construct rich plain text notes including per-item customization details so it renders perfectly on existing dashboards
    let detailedNotes = note ? `หมายเหตุทั่วไป: ${note}\n` : ''
    items.forEach(item => {
      const custom = itemCustomizations[item.id]
      if (custom) {
        const itemOptions = []
        if (custom.noVeg) itemOptions.push("ไม่ใส่ผัก")
        if (custom.extra) itemOptions.push("พิเศษ (+฿15)")
        if (custom.utensils) itemOptions.push("รับช้อนส้อมพลาสติก")
        if (custom.spicyLevel === "none") itemOptions.push("ไม่เผ็ด")
        if (custom.spicyLevel === "mild") itemOptions.push("เผ็ดน้อย")
        if (custom.spicyLevel === "spicy") itemOptions.push("เผ็ดมาก")
        
        if (itemOptions.length > 0) {
          detailedNotes += `- ${item.name}: ${itemOptions.join(", ")}\n`
        }
      }
    })

    const orderItems = items.map(item => {
      const custom = itemCustomizations[item.id] || { noVeg: false, spicyLevel: "normal", extra: false, utensils: false }
      const extraCharge = custom.extra ? 15 : 0
      return {
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price + extraCharge  // Store custom price if Extra is checked
      }
    })

    const result = await createOrder(
      restaurantId, 
      orderItems, 
      total, 
      deliveryFee, 
      { 
        address: deliveryAddressObj?.address, 
        note: detailedNotes.trim(), 
        payment_method: selectedPayment,
        item_customizations: itemCustomizations // Store raw structured JSON for future scaling
      },
      paymentSlipUrl,
      appliedCoupon ? { couponId: appliedCoupon.couponId, discount: appliedCoupon.discount } : undefined
    )

    if (result.error) {
      showNotification({ type: 'error', title: 'เกิดข้อผิดพลาด', message: result.error })
      setIsProcessing(false)
      return
    }

    clearCart()
    showNotification({ type: 'success', title: 'สั่งอาหารสำเร็จ! 🎉', message: 'รายการสั่งซื้อของคุณถูกจัดส่งไปยังห้องครัวแล้ว' })
    router.push(`/orders/${result.orderId}`)
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-[#f9f6f5] flex flex-col items-center justify-center p-6 text-center font-thai">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md mb-4 text-[#ffd709]">
          <span className="material-symbols-outlined text-4xl">shopping_cart</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ตะกร้าของคุณว่างเปล่า</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">กรุณาเลือกเมนูอาหารแสนอร่อยลงตะกร้าก่อนดำเนินการชำระเงิน</p>
        <Button onClick={() => router.push('/customer')} className="font-bold bg-[#ffd709] text-black hover:bg-yellow-500 rounded-xl px-6 py-5">
          กลับไปเลือกเมนูอาหาร
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f6f5] pb-28 font-thai">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">ชำระเงิน</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {/* Delivery Address */}
        <Card className="shadow-sm border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
              <MapPin className="h-5 w-5 text-[#ffd709]" />
              ที่อยู่จัดส่ง
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl mb-3">
                <p className="text-sm text-gray-500 mb-3">ยังไม่มีที่อยู่จัดส่งสำหรับบัญชีของคุณ</p>
                <Link href="/profile/addresses">
                  <Button variant="outline" size="sm" className="font-bold rounded-xl border-[#ffd709] text-yellow-600 hover:bg-yellow-50">
                    เพิ่มที่อยู่ใหม่เลย
                  </Button>
                </Link>
              </div>
            ) : (
              <RadioGroup
                value={selectedAddress}
                onValueChange={setSelectedAddress}
                className="space-y-3"
              >
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all duration-200 active:scale-[0.98] ${
                      selectedAddress === addr.id
                        ? "border-[#ffd709] bg-yellow-50/20"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{addr.title}</span>
                        {addr.is_default && (
                          <Badge className="bg-[#ffd709] text-black text-[10px] hover:bg-[#ffd709] font-bold rounded-md px-1.5 py-0.5">
                            ค่าเริ่มต้น
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.address}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {addresses.length > 0 && (
              <Link href="/profile/addresses" className="block w-full">
                <Button variant="outline" className="mt-3 w-full bg-transparent rounded-2xl border-dashed border-gray-300 hover:border-[#ffd709] text-gray-600 font-bold">
                  <Plus className="mr-1 h-4 w-4" />
                  จัดการที่อยู่จัดส่งเพิ่มเติม
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Order Summary & Interactive Items List */}
        <Card className="shadow-sm border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="flex items-center justify-between text-base font-bold text-gray-800">
              <span>รายการสั่งซื้อจากร้าน</span>
              <Badge variant="outline" className="flex items-center gap-1 rounded-full px-2 py-0.5 font-bold border-gray-200 text-gray-600 bg-gray-50">
                <Clock className="h-3 w-3" />
                15-25 นาที
              </Badge>
            </CardTitle>
            <p className="text-sm font-black text-gray-900 mt-1">{restaurantName}</p>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-4 divide-y divide-gray-100">
              {items.map((item, idx) => {
                const custom = itemCustomizations[item.id] || { noVeg: false, spicyLevel: "normal", extra: false, utensils: false }
                const extraCharge = custom.extra ? 15 : 0

                return (
                  <div key={item.id} className={`pt-4 ${idx === 0 ? "pt-0 border-t-0" : ""}`}>
                    {/* Main Row */}
                    <div className="flex gap-4 items-start">
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🍜</span>
                        )}
                      </div>

                      {/* Info & Price */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">ราคาต่อหน่วย: {formatPrice(item.price + extraCharge)}</p>
                        <p className="text-sm font-extrabold text-gray-900 mt-1">รวม: {formatPrice((item.price + extraCharge) * item.quantity)}</p>
                      </div>

                      {/* Quantity Controller & Delete */}
                      <div className="flex items-center gap-1 shrink-0 bg-gray-50 rounded-full p-1 border border-gray-100">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-100 active:scale-90 transition-transform"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-gray-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-100 active:scale-90 transition-transform"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        
                        <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Customization Detail Toggles */}
                    <div className="mt-3 ml-2 pl-4 border-l-2 border-[#ffd709]/50 space-y-2">
                      <p className="text-[11px] font-extrabold text-gray-500 tracking-wider uppercase">รายละเอียด & ตัวเลือกจานนี้</p>
                      
                      {/* Checkboxes Group */}
                      <div className="flex gap-2 flex-wrap">
                        {/* No Veg Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleCustomization(item.id, "noVeg")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                            custom.noVeg
                              ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                              : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xs">🥬</span>
                          ไม่ใส่ผัก
                          {custom.noVeg && <span className="material-symbols-outlined text-[12px] font-black">check</span>}
                        </button>

                        {/* Utensils Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleCustomization(item.id, "utensils")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                            custom.utensils
                              ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                              : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xs">🍴</span>
                          รับช้อนส้อม
                          {custom.utensils && <span className="material-symbols-outlined text-[12px] font-black">check</span>}
                        </button>

                        {/* Extra Checkbox (+15 THB) */}
                        <button
                          type="button"
                          onClick={() => toggleCustomization(item.id, "extra")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                            custom.extra
                              ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
                              : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xs">✨</span>
                          พิเศษ (+฿15)
                          {custom.extra && <span className="material-symbols-outlined text-[12px] font-black">check</span>}
                        </button>
                      </div>

                      {/* Spicy Level Pills Selector */}
                      <div className="flex items-center gap-2 pt-1.5">
                        <span className="text-xs font-bold text-gray-600 shrink-0">ความเผ็ด:</span>
                        <div className="flex gap-1.5">
                          {[
                            { id: "none", label: "ไม่เผ็ด", color: "bg-gray-50 text-gray-700 border-gray-100" },
                            { id: "mild", label: "เผ็ดน้อย", color: "bg-orange-50 text-orange-700 border-orange-200" },
                            { id: "normal", label: "ปกติ", color: "bg-red-50/50 text-red-600 border-red-100" },
                            { id: "spicy", label: "เผ็ดมาก", color: "bg-red-100 text-red-700 border-red-200" }
                          ].map(sp => {
                            const isSelected = custom.spicyLevel === sp.id
                            return (
                              <button
                                key={sp.id}
                                type="button"
                                onClick={() => changeSpicyLevel(item.id, sp.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all active:scale-95 ${
                                  isSelected 
                                    ? `${sp.color} shadow-sm ring-1 ring-offset-0 ring-current/20`
                                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                                }`}
                              >
                                {sp.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Label htmlFor="note" className="text-sm font-bold text-gray-700">หมายเหตุหรือข้อความถึงคนขับ/ร้านเพิ่มเติม</Label>
              <Input
                id="note"
                placeholder="เช่น วางอาหารไว้ที่หน้าบ้าน, โทรหาเมื่อมาถึง..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1.5 rounded-2xl border-gray-200 p-5 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card className="shadow-sm border-0 bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-4">
            <Label htmlFor="promo" className="text-sm font-bold text-gray-700">รหัสส่วนลดโปรโมชั่น</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                id="promo"
                placeholder="ใส่รหัสเพื่อลดราคาทันที"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase())
                  setAppliedCoupon(null)
                  setCouponError("")
                }}
                className="rounded-xl border-gray-200"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isCheckingCoupon || !promoCode.trim()}
                className="rounded-xl px-5 border-[#ffd709] text-yellow-600 hover:bg-yellow-50 font-bold disabled:opacity-50"
              >
                {isCheckingCoupon ? "กำลังตรวจสอบ..." : "ใช้รหัส"}
              </Button>
            </div>
            {appliedCoupon && (
              <p className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                ใช้รหัส {appliedCoupon.code} สำเร็จ! ลด {formatPrice(appliedCoupon.discount)}
              </p>
            )}
            {couponError && (
              <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {couponError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="shadow-sm border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
              <CreditCard className="h-5 w-5 text-[#ffd709]" />
              ช่องทางชำระเงิน
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RadioGroup
              value={selectedPayment}
              onValueChange={setSelectedPayment}
              className="space-y-3"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200 active:scale-[0.98] ${
                    selectedPayment === method.id
                      ? "border-[#ffd709] bg-yellow-50/20"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="text-gray-500">{method.icon}</div>
                  <span className="font-bold text-gray-800">{method.label}</span>
                </div>
              ))}
            </RadioGroup>

            {selectedPayment === "promptpay" && (
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
                <div className="bg-gradient-to-br from-[#0f2e5c] to-[#1d4782] text-white rounded-2xl p-5 shadow-inner relative overflow-hidden">
                  {/* Brand Header */}
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-1 rounded-lg">
                        <span className="text-[#0f2e5c] font-black text-[10px] tracking-tighter">Prompt Pay</span>
                      </div>
                      <span className="text-xs font-bold text-blue-200 font-thai">พร้อมเพย์</span>
                    </div>
                    <span className="text-[10px] bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-full font-mono">TH-QR</span>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-200/50">
                    <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center relative overflow-hidden p-1">
                      <img 
                        src={`https://promptpay.io/0991234567/${total}.png`}
                        alt="PromptPay QR Code"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    
                    <p className="mt-3 text-[10px] font-bold text-gray-400 font-thai">สแกนชำระเงินตามจำนวนยอดรวม</p>
                    <p className="text-[#0f2e5c] font-black text-2xl mt-1 tracking-tight">{formatPrice(total)}</p>
                  </div>

                  {/* Account Info */}
                  <div className="mt-4 space-y-1 text-center font-thai">
                    <p className="text-xs text-blue-200">ชื่อบัญชี: บจก. ธันเดอร์ ฟู้ด (ประเทศไทย)</p>
                    <p className="text-sm font-mono font-bold tracking-widest text-white">099-123-4567</p>
                  </div>
                </div>

                {/* Custom File Upload Dropzone */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-thai">แนบหลักฐานการโอนเงิน (สลิป)</Label>
                  
                  {!slipPreview ? (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 transition-all hover:border-[#ffd709] bg-gray-50/50 flex flex-col items-center justify-center group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#6c5a00] group-hover:bg-yellow-50 transition-colors">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-gray-700 font-thai">เลือกรูปภาพสลิปโอนเงิน</p>
                      <p className="text-xs text-gray-400 mt-1 font-thai">รองรับ JPG, PNG (ขนาดไม่เกิน 5MB)</p>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 p-3">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-white">
                        <img 
                          src={slipPreview} 
                          alt="Slip Preview" 
                          className="w-full h-full object-contain"
                        />
                        {isUploadingSlip && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                            <span className="w-8 h-8 rounded-full border-4 border-white border-t-transparent animate-spin mb-2" />
                            <span className="text-xs font-bold font-thai">กำลังอัปโหลดสลิป...</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-600 truncate font-mono">{slipFile?.name}</span>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          disabled={isUploadingSlip}
                          onClick={handleClearFile}
                          className="w-8 h-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="shadow-sm border-0 bg-gray-100 rounded-3xl overflow-hidden">
          <CardContent className="p-5">
            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-gray-500">ยอดรวมสินค้า</span>
                <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ค่าจัดส่ง</span>
                <span className="font-bold text-gray-800">{formatPrice(deliveryFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>ส่วนลดโปรโมชั่น</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="py-2">
                <Separator />
              </div>
              <div className="flex justify-between text-base font-black">
                <span className="text-gray-800">ยอดรวมสุทธิ</span>
                <span className="text-black text-xl">{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="mx-auto max-w-2xl">
          <Button
            className="w-full bg-[#ffd709] text-black hover:bg-yellow-500 py-6 text-lg font-bold rounded-2xl shadow-sm active:scale-98 transition-transform"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                กำลังส่งรายการสั่งซื้อ...
              </>
            ) : (
              <>
                ยืนยันการสั่งซื้ออาหาร • {formatPrice(total)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
