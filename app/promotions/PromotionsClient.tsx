"use client";

import { BottomNav } from "@/components/thunder/bottom-nav";
import { RestaurantCard } from "@/components/thunder/restaurant-card";
import { CartProvider } from "@/components/thunder/cart-context";
import { NotificationProvider } from "@/components/thunder/notification-popup";
import { FloatingCartButton } from "@/components/thunder/cart-sheet";
import { ArrowLeft, Percent, Clock, Zap, Gift } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

const promoCategories = [
  { id: "all", label: "ทั้งหมด", icon: Percent },
  { id: "flash", label: "Flash Sale", icon: Zap },
  { id: "free-delivery", label: "ฟรีค่าส่ง", icon: Clock },
  { id: "bundle", label: "ซื้อ 1 แถม 1", icon: Gift },
];

const promoRestaurants = [
  {
    id: "1d9b6f62-a7d2-45ab-95d7-2a70de10e785",
    name: "ร้านก๋วยเตี๋ยวเรือ ป้าแดง",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "15-20 นาที",
    distance: "0.8 กม.",
    promo: "ฟรีค่าส่ง",
    tags: ["ก๋วยเตี๋ยว", "อาหารไทย"],
    promoType: "free-delivery",
  },
  {
    id: "cc1a7c2e-ec0d-4f81-9c9e-13d071161415",
    name: "Burger Anzay",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    rating: 4.7,
    reviewCount: 567,
    deliveryTime: "20-25 นาที",
    distance: "1.5 กม.",
    promo: "ซื้อ 2 แถม 1",
    tags: ["เบอร์เกอร์", "ฟาสต์ฟู้ด"],
    promoType: "bundle",
  },
  {
    id: "63a03417-aa30-40fb-9376-38a31e95e536",
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "15-20 นาที",
    distance: "0.8 กม.",
    promo: "-40%",
    tags: ["ซูชิ", "อาหารญี่ปุ่น"],
    promoType: "flash",
  },
  {
    id: "9c27fc50-66cc-4300-8cbf-4add04409531",
    name: "ส้มตำ นัว นัว",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400",
    rating: 4.5,
    reviewCount: 445,
    deliveryTime: "25-30 นาที",
    distance: "1.8 กม.",
    promo: "-30%",
    tags: ["ส้มตำ", "อีสาน"],
    promoType: "flash",
  },
  {
    id: "ea964394-77be-4cf8-a049-0d26d28b862d",
    name: "ส้มตำสกล",
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=400",
    rating: 4.6,
    reviewCount: 289,
    deliveryTime: "10-15 นาที",
    distance: "0.5 กม.",
    promo: "ซื้อ 1 แถม 1",
    tags: ["ส้มตำ", "อีสาน"],
    promoType: "bundle",
  }
];

export default function PromotionsClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPromos = promoRestaurants.filter(
    (item) =>
      selectedCategory === "all" || item.promoType === selectedCategory
  );

  return (
    <CartProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-background pb-36">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="max-w-md mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="font-bold text-lg">โปรโมชั่น</h1>
                  <p className="text-xs text-muted-foreground">
                    ดีลพิเศษสำหรับคุณ
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-md mx-auto px-4 py-4 space-y-4">
            {/* Promo Categories */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-2 pb-2">
                {promoCategories.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flash Sale Banner */}
            <div className="bg-accent rounded-2xl p-4 text-accent-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="font-bold">Flash Sale!</span>
              </div>
              <p className="text-sm opacity-90">
                ลดสูงสุด 50% เฉพาะวันนี้ 12:00 - 14:00 น.
              </p>
              <div className="flex gap-2 mt-3">
                <div className="bg-background/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-lg font-bold">02</span>
                  <p className="text-[10px]">ชั่วโมง</p>
                </div>
                <div className="bg-background/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-lg font-bold">45</span>
                  <p className="text-[10px]">นาที</p>
                </div>
                <div className="bg-background/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-lg font-bold">30</span>
                  <p className="text-[10px]">วินาที</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-3">
              {filteredPromos.map((item) => (
                <RestaurantCard key={item.id} {...item} />
              ))}
            </div>
          </main>

          <FloatingCartButton />
          <BottomNav />
        </div>
      </NotificationProvider>
    </CartProvider>
  );
}
