export const dynamic = "force-dynamic";

import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch some aggregate stats
  const { count: restaurantCount } = await supabase.from('restaurants').select('*', { count: 'exact', head: true })
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })

  // Active orders (pending, preparing, ready, picking_up, delivering)
  const { count: activeOrderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'preparing', 'ready', 'picking_up', 'delivering'])

  // Get unverified restaurants
  const { data: unverifiedRestaurants } = await supabase
    .from('restaurants')
    .select('id, name, created_at')
    .eq('is_verified', false)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tight text-[#0e0e0e]">System Overview</h2>
          <p className="text-[#5c5b5b] mt-1 font-thai">ภาพรวมระบบทั้งหมดของ Thunder Food</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-bold text-gray-700">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#5c5b5b] text-sm font-bold font-thai">ร้านอาหารทั้งหมด</p>
                <h3 className="text-4xl font-black mt-2">{restaurantCount || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Store className="text-orange-500" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp size={14} /> <span>+2% จากสัปดาห์ที่แล้ว</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#5c5b5b] text-sm font-bold font-thai">ผู้ใช้งานทั้งหมด</p>
                <h3 className="text-4xl font-black mt-2">{userCount || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-500" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp size={14} /> <span>+5% จากสัปดาห์ที่แล้ว</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#5c5b5b] text-sm font-bold font-thai">ออเดอร์ทั้งหมด</p>
                <h3 className="text-4xl font-black mt-2">{orderCount || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="text-purple-500" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp size={14} /> <span>+12% จากสัปดาห์ที่แล้ว</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-lg bg-[#ffd709] overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#5b4b00] text-sm font-bold font-thai">กำลังดำเนินการ</p>
                <h3 className="text-4xl font-black mt-2 text-[#0e0e0e]">{activeOrderCount || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-[#f95630] animate-ping absolute"></div>
                <div className="w-3 h-3 rounded-full bg-[#f95630]"></div>
              </div>
            </div>
            <div className="mt-4 text-xs font-bold text-[#0e0e0e]">
              ออเดอร์ในระบบ ณ ขณะนี้
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Needed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold font-thai flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={20} />
              ร้านอาหารรอการอนุมัติ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unverifiedRestaurants && unverifiedRestaurants.length > 0 ? (
              <div className="space-y-3">
                {unverifiedRestaurants.map(rest => (
                  <div key={rest.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-900">{rest.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">รอตรวจสอบเอกสาร</p>
                    </div>
                    <Link href="/admin/restaurants" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                      ตรวจสอบ
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 font-thai text-sm">
                ไม่มีร้านอาหารรอการอนุมัติในขณะนี้
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
