"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Search,
  ShoppingBag,
  User,
  Store,
  Bike,
  Smartphone,
  ArrowRight,
  Bell,
  MapPin,
  CreditCard,
  Gift,
  ClipboardList,
  Settings,
  Star,
  Clock,
  TrendingUp,
  Package,
  Navigation,
  Wallet,
  Menu,
  Image,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DiagramClient() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#FFD700] px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-10 w-10 text-black" fill="currentColor" />
            <h1 className="text-3xl font-bold text-black">Thunder Delivery</h1>
          </div>
          <p className="text-black/80">App Architecture Diagram</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="customer" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
              Customer
            </TabsTrigger>
            <TabsTrigger value="restaurant" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
              Restaurant
            </TabsTrigger>
            <TabsTrigger value="rider" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
              Rider
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              {/* App Structure */}
              <Card className="border-2 border-black">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Thunder Delivery - System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer App */}
                    <div className="border-2 border-[#FFD700] rounded-xl p-4 bg-[#FFD700]/10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center">
                          <User className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black">Customer App</h3>
                          <p className="text-xs text-gray-600">สำหรับลูกค้า</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Home className="h-4 w-4 text-[#FFD700]" />
                          <span>Home - หน้าหลัก</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Search className="h-4 w-4 text-[#FFD700]" />
                          <span>Search - ค้นหา</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <ShoppingBag className="h-4 w-4 text-[#FFD700]" />
                          <span>Orders - คำสั่งซื้อ</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <User className="h-4 w-4 text-[#FFD700]" />
                          <span>Profile - โปรไฟล์</span>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant App */}
                    <div className="border-2 border-black rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                          <Store className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black">Restaurant App</h3>
                          <p className="text-xs text-gray-600">สำหรับร้านอาหาร</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <ClipboardList className="h-4 w-4 text-black" />
                          <span>Dashboard - แดชบอร์ด</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <ShoppingBag className="h-4 w-4 text-black" />
                          <span>Orders - จัดการออเดอร์</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Menu className="h-4 w-4 text-black" />
                          <span>Menu - จัดการเมนู</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Settings className="h-4 w-4 text-black" />
                          <span>Profile - ตั้งค่าร้าน</span>
                        </div>
                      </div>
                    </div>

                    {/* Rider App */}
                    <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <Bike className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black">Rider App</h3>
                          <p className="text-xs text-gray-600">สำหรับไรเดอร์</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Package className="h-4 w-4 text-gray-700" />
                          <span>Available - งานที่รับได้</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Navigation className="h-4 w-4 text-gray-700" />
                          <span>Active - งานปัจจุบัน</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Wallet className="h-4 w-4 text-gray-700" />
                          <span>Earnings - รายได้</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <User className="h-4 w-4 text-gray-700" />
                          <span>Profile - โปรไฟล์</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrows */}
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Badge variant="outline" className="border-[#FFD700] text-black px-4 py-2">
                      Customer สั่งอาหาร
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <Badge variant="outline" className="border-black text-black px-4 py-2">
                      Restaurant ทำอาหาร
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <Badge variant="outline" className="border-gray-500 text-black px-4 py-2">
                      Rider ส่งอาหาร
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Components */}
              <Card className="border-2 border-gray-200">
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-black">Shared Components</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Logo", desc: "โลโก้ Thunder" },
                      { name: "Bottom Nav", desc: "เมนูด้านล่าง" },
                      { name: "Promo Carousel", desc: "สไลด์โปรโมชั่น" },
                      { name: "Category Grid", desc: "หมวดหมู่อาหาร" },
                      { name: "Restaurant Card", desc: "การ์ดร้านอาหาร" },
                      { name: "Menu Item Card", desc: "การ์ดรายการอาหาร" },
                      { name: "Cart Sheet", desc: "ตะกร้าสินค้า" },
                      { name: "Address Selector", desc: "เลือกที่อยู่" },
                      { name: "Search Bar", desc: "ช่องค้นหา" },
                      { name: "Notification Popup", desc: "แจ้งเตือน" },
                      { name: "Cart Context", desc: "จัดการ State ตะกร้า" },
                      { name: "Category Section", desc: "ส่วนหมวดหมู่" },
                    ].map((comp, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border">
                        <p className="font-medium text-sm text-black">{comp.name}</p>
                        <p className="text-xs text-gray-500">{comp.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Tab */}
          <TabsContent value="customer">
            <div className="space-y-6">
              <Card className="border-2 border-[#FFD700]">
                <CardHeader className="bg-[#FFD700]">
                  <CardTitle className="text-black flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer App Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* User Flow Diagram */}
                  <div className="space-y-6">
                    {/* Home Page */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">1</div>
                        <h3 className="font-bold text-lg">Home Page (หน้าหลัก)</h3>
                        <Link href="/">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Address Selector</p>
                          <p className="text-xs text-gray-500">เลือกที่อยู่จัดส่ง</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <Search className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Search Bar</p>
                          <p className="text-xs text-gray-500">ค้นหาอาหาร/ร้าน</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <Image className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Promo Slider</p>
                          <p className="text-xs text-gray-500">โปรโมชั่น (Auto-slide)</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <Menu className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Categories</p>
                          <p className="text-xs text-gray-500">หมวดหมู่อาหาร</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Nearby Stores</p>
                          <p className="text-xs text-gray-500">ร้านค้าใกล้ฉัน</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <Star className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Recommended</p>
                          <p className="text-xs text-gray-500">ร้านค้าแนะนำ</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Popular</p>
                          <p className="text-xs text-gray-500">ยอดนิยม</p>
                        </div>
                        <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                          <Bell className="h-5 w-5 text-[#FFD700] mb-1" />
                          <p className="text-sm font-medium">Notifications</p>
                          <p className="text-xs text-gray-500">แจ้งเตือน</p>
                        </div>
                      </div>
                    </div>

                    {/* Search Page */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">2</div>
                        <h3 className="font-bold text-lg">Search Page (ค้นหา)</h3>
                        <Link href="/search">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Search Input</p>
                          <p className="text-xs text-gray-500">พิมพ์ค้นหา</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Filters</p>
                          <p className="text-xs text-gray-500">กรองผลลัพธ์</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Results</p>
                          <p className="text-xs text-gray-500">แสดงผลการค้นหา</p>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Detail */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">3</div>
                        <h3 className="font-bold text-lg">Restaurant Detail (รายละเอียดร้าน)</h3>
                        <Link href="/restaurant/1">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Restaurant Info</p>
                          <p className="text-xs text-gray-500">ข้อมูลร้าน</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Menu Categories</p>
                          <p className="text-xs text-gray-500">หมวดเมนู</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Menu Items</p>
                          <p className="text-xs text-gray-500">รายการอาหาร</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Add to Cart</p>
                          <p className="text-xs text-gray-500">เพิ่มลงตะกร้า</p>
                        </div>
                      </div>
                    </div>

                    {/* Cart & Checkout */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">4</div>
                        <h3 className="font-bold text-lg">Cart & Checkout (ตะกร้า & ชำระเงิน)</h3>
                        <Link href="/checkout">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Cart Sheet</p>
                          <p className="text-xs text-gray-500">ตะกร้าสินค้า</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Delivery Address</p>
                          <p className="text-xs text-gray-500">ที่อยู่จัดส่ง</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <CreditCard className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Payment</p>
                          <p className="text-xs text-gray-500">ช่องทางชำระเงิน</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Gift className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Promo Code</p>
                          <p className="text-xs text-gray-500">โค้ดส่วนลด</p>
                        </div>
                      </div>
                    </div>

                    {/* Orders */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">5</div>
                        <h3 className="font-bold text-lg">Orders (คำสั่งซื้อ)</h3>
                        <Link href="/orders">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Active Orders</p>
                          <p className="text-xs text-gray-500">ออเดอร์ที่กำลังดำเนินการ</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Package className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Order History</p>
                          <p className="text-xs text-gray-500">ประวัติการสั่ง</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Navigation className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Track Order</p>
                          <p className="text-xs text-gray-500">ติดตามออเดอร์</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Star className="h-5 w-5 text-gray-700 mb-1" />
                          <p className="text-sm font-medium">Rate & Review</p>
                          <p className="text-xs text-gray-500">ให้คะแนนและรีวิว</p>
                        </div>
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">6</div>
                        <h3 className="font-bold text-lg">Profile (โปรไฟล์)</h3>
                        <Link href="/profile">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Personal Info</p>
                          <p className="text-xs text-gray-500">ข้อมูลส่วนตัว</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Addresses</p>
                          <p className="text-xs text-gray-500">ที่อยู่ที่บันทึก</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Payment Methods</p>
                          <p className="text-xs text-gray-500">วิธีชำระเงิน</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Settings</p>
                          <p className="text-xs text-gray-500">ตั้งค่า</p>
                        </div>
                      </div>
                    </div>

                    {/* Promotions */}
                    <div className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">7</div>
                        <h3 className="font-bold text-lg">Promotions (โปรโมชั่น)</h3>
                        <Link href="/promotions">
                          <Badge className="bg-black text-white hover:bg-gray-800">ไปหน้านี้</Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Active Promos</p>
                          <p className="text-xs text-gray-500">โปรโมชั่นที่ใช้ได้</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Flash Deals</p>
                          <p className="text-xs text-gray-500">ดีลเวลาจำกัด</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Vouchers</p>
                          <p className="text-xs text-gray-500">คูปองส่วนลด</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Restaurant Tab */}
          <TabsContent value="restaurant">
            <Card className="border-2 border-black">
              <CardHeader className="bg-black text-white">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Restaurant Dashboard Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Dashboard */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="font-bold text-lg">Dashboard (แดชบอร์ด)</h3>
                    <Link href="/restaurant">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Today Sales</p>
                      <p className="text-xs text-gray-500">ยอดขายวันนี้</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Pending Orders</p>
                      <p className="text-xs text-gray-500">ออเดอร์รอดำเนินการ</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Completed Orders</p>
                      <p className="text-xs text-gray-500">ออเดอร์สำเร็จ</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Store Status</p>
                      <p className="text-xs text-gray-500">สถานะร้าน (เปิด/ปิด)</p>
                    </div>
                  </div>
                </div>

                {/* Orders Management */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="font-bold text-lg">Orders Management (จัดการออเดอร์)</h3>
                    <Link href="/restaurant/orders">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">New Orders</p>
                      <p className="text-xs text-gray-500">ออเดอร์ใหม่</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Preparing</p>
                      <p className="text-xs text-gray-500">กำลังเตรียม</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Ready</p>
                      <p className="text-xs text-gray-500">พร้อมส่ง</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-xs text-gray-500">เสร็จสิ้น</p>
                    </div>
                  </div>
                </div>

                {/* Menu Management */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="font-bold text-lg">Menu Management (จัดการเมนู)</h3>
                    <Link href="/restaurant/menu">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Add Item</p>
                      <p className="text-xs text-gray-500">เพิ่มเมนู</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Edit Item</p>
                      <p className="text-xs text-gray-500">แก้ไขเมนู</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Categories</p>
                      <p className="text-xs text-gray-500">จัดหมวดหมู่</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Stock Status</p>
                      <p className="text-xs text-gray-500">สถานะสินค้า</p>
                    </div>
                  </div>
                </div>

                {/* Store Profile */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">4</div>
                    <h3 className="font-bold text-lg">Store Profile (ตั้งค่าร้าน)</h3>
                    <Link href="/restaurant/profile">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Store Info</p>
                      <p className="text-xs text-gray-500">ข้อมูลร้าน</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Operating Hours</p>
                      <p className="text-xs text-gray-500">เวลาทำการ</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Bank Account</p>
                      <p className="text-xs text-gray-500">บัญชีธนาคาร</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-gray-500">การแจ้งเตือน</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rider Tab */}
          <TabsContent value="rider">
            <Card className="border-2 border-gray-500">
              <CardHeader className="bg-gray-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Rider App Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Available Jobs */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="font-bold text-lg">Available Jobs (งานที่รับได้)</h3>
                    <Link href="/rider">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Available Orders</p>
                      <p className="text-xs text-gray-500">ออเดอร์ที่รับได้</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Distance Filter</p>
                      <p className="text-xs text-gray-500">กรองตามระยะทาง</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Accept Order</p>
                      <p className="text-xs text-gray-500">รับออเดอร์</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Online/Offline</p>
                      <p className="text-xs text-gray-500">สถานะพร้อมรับงาน</p>
                    </div>
                  </div>
                </div>

                {/* Active Delivery */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="font-bold text-lg">Active Delivery (งานปัจจุบัน)</h3>
                    <Link href="/rider/active">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-xs text-gray-500">จุดรับอาหาร</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Navigation</p>
                      <p className="text-xs text-gray-500">นำทาง</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Order Details</p>
                      <p className="text-xs text-gray-500">รายละเอียดออเดอร์</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Update Status</p>
                      <p className="text-xs text-gray-500">อัพเดทสถานะ</p>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="font-bold text-lg">Earnings (รายได้)</h3>
                    <Link href="/rider/earnings">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Today Earnings</p>
                      <p className="text-xs text-gray-500">รายได้วันนี้</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Weekly Summary</p>
                      <p className="text-xs text-gray-500">สรุปรายสัปดาห์</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Trip History</p>
                      <p className="text-xs text-gray-500">ประวัติการส่ง</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Withdraw</p>
                      <p className="text-xs text-gray-500">ถอนเงิน</p>
                    </div>
                  </div>
                </div>

                {/* Rider Profile */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">4</div>
                    <h3 className="font-bold text-lg">Profile (โปรไฟล์)</h3>
                    <Link href="/rider/profile">
                      <Badge className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">ไปหน้านี้</Badge>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Personal Info</p>
                      <p className="text-xs text-gray-500">ข้อมูลส่วนตัว</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Vehicle Info</p>
                      <p className="text-xs text-gray-500">ข้อมูลยานพาหนะ</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Bank Account</p>
                      <p className="text-xs text-gray-500">บัญชีธนาคาร</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Performance</p>
                      <p className="text-xs text-gray-500">ผลงาน/คะแนน</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <Card className="mt-8 border-2 border-[#FFD700]">
          <CardHeader className="bg-[#FFD700]">
            <CardTitle className="text-black">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/restaurant">
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  <Store className="h-4 w-4 mr-2" />
                  Restaurant
                </Button>
              </Link>
              <Link href="/rider">
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  <Bike className="h-4 w-4 mr-2" />
                  Rider
                </Button>
              </Link>
              <Link href="/promotions">
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  <Gift className="h-4 w-4 mr-2" />
                  Promotions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
