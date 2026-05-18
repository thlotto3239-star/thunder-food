export const dynamic = "force-dynamic";

import React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  Heart,
  Gift,
  Star,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/thunder/bottom-nav"
import { createClient } from "@/utils/supabase/server"
import LogoutButton from "./LogoutButton"

const menuItems = [
  { icon: <Heart className="h-5 w-5" />, label: "ร้านโปรด", labelEn: "Favorites", href: "/profile/favorites" },
  { icon: <MapPin className="h-5 w-5" />, label: "ที่อยู่จัดส่ง", labelEn: "Addresses", href: "/profile/addresses" },
  { icon: <CreditCard className="h-5 w-5" />, label: "วิธีชำระเงิน", labelEn: "Payment Methods", href: "/profile/payment" },
  { icon: <Gift className="h-5 w-5" />, label: "โปรโมชั่น & คูปอง", labelEn: "Promotions", href: "/promotions" },
  { icon: <Star className="h-5 w-5" />, label: "รีวิวของฉัน", labelEn: "My Reviews", href: "/profile/reviews" },
]

const settingsItems = [
  { icon: <Bell className="h-5 w-5" />, label: "การแจ้งเตือน", labelEn: "Notifications", href: "/profile/notifications" },
  { icon: <Settings className="h-5 w-5" />, label: "ตั้งค่า", labelEn: "Settings", href: "/profile/settings" },
  { icon: <HelpCircle className="h-5 w-5" />, label: "ช่วยเหลือ", labelEn: "Help & Support", href: "/profile/support" },
]

function MenuItem({ 
  icon, 
  label, 
  labelEn, 
  href 
}: { 
  icon: React.ReactNode
  label: string
  labelEn: string
  href: string 
}) {
  return (
    <Link href={href}>
      <div className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <div>
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{labelEn}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  )
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userProfile = null;
  let orderCount = 0;
  let favoritesCount = 0;
  
  if (user) {
    // Fetch user details from public.users
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();
    
    userProfile = profile;

    // Get order count
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id);
      
    orderCount = count || 0;

    // Get favorites count
    const { count: favCount } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
      
    favoritesCount = favCount || 0;
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#ffd709] to-[#e5c108] px-4 pb-8 pt-10">
        <div className="mx-auto max-w-md">
          <div className="mb-4 flex justify-center">
            <h1 className="text-2xl font-black font-thai text-[#1c1c1e] tracking-tight">Thunder Food</h1>
          </div>
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted flex-shrink-0">
                  <Image
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.full_name || 'User'}`}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-foreground truncate">{userProfile?.full_name || 'ผู้ใช้งาน'}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-xs text-[#e5c108]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#e5c108] bg-[#ffd709]/10 px-2 py-0.5 rounded-full border border-[#ffd709]/20 inline-block">CUSTOMER</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">phone</span>
                    {userProfile?.phone || 'ยังไม่ระบุเบอร์โทรศัพท์'}
                  </p>
                </div>
                <Link href="/profile/settings" className="flex-shrink-0">
                  <Button variant="outline" size="sm">
                    <User className="mr-1 h-4 w-4" />
                    แก้ไข
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        {/* Stats */}
        <Card className="mb-6 overflow-hidden shadow-sm border-border">
          <CardContent className="grid grid-cols-3 divide-x p-0">
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-[#e5c108]">{orderCount}</span>
              <span className="text-xs text-muted-foreground mt-1">คำสั่งซื้อ</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-[#e5c108]">{favoritesCount}</span>
              <span className="text-xs text-muted-foreground mt-1">ร้านโปรด</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-[#e5c108]">0</span>
              <span className="text-xs text-muted-foreground mt-1">คูปอง</span>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6 shadow-sm border-border">
          <CardContent className="p-4">
            {menuItems.map((item, index) => (
              <div key={index}>
                <MenuItem {...item} />
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-6 shadow-sm border-border">
          <CardContent className="p-4">
            {settingsItems.map((item, index) => (
              <div key={index}>
                <MenuItem {...item} />
                {index < settingsItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <LogoutButton />
      </main>

      <BottomNav />
    </div>
  )
}
