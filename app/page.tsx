export const dynamic = "force-dynamic";

// Server Component

import { ThunderLogo } from "@/components/thunder/logo";
import { BottomNav } from "@/components/thunder/bottom-nav";
import { PromoSlider } from "@/components/thunder/promo-slider";
import { CategorySection } from "@/components/thunder/category-section";
import { RestaurantCard } from "@/components/thunder/restaurant-card";
import { SearchBar } from "@/components/thunder/search-bar";
import { AddressSelector } from "@/components/thunder/address-selector";
import { CartSheet, FloatingCartButton } from "@/components/thunder/cart-sheet";
import { CartProvider } from "@/components/thunder/cart-context";
import { NotificationProvider } from "@/components/thunder/notification-popup";
import { Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

const nearbyRestaurants = [
  {
    id: "1",
    name: "ร้านก๋วยเตี๋ยวเรือ ป้าแดง",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "15-20 นาที",
    distance: "0.8 กม.",
    promo: "ฟรีค่าส่ง",
    tags: ["ก๋วยเตี๋ยว", "อาหารไทย"],
  },
  {
    id: "2",
    name: "Burger Anzay",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    rating: 4.6,
    reviewCount: 512,
    deliveryTime: "20-25 นาที",
    distance: "1.2 กม.",
    tags: ["เบอร์เกอร์", "ฟาสต์ฟู้ด"],
  },
  {
    id: "3",
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    rating: 4.9,
    reviewCount: 892,
    deliveryTime: "25-30 นาที",
    distance: "1.5 กม.",
    promo: "-20%",
    tags: ["ซูชิ", "อาหารญี่ปุ่น"],
  },
  {
    id: "4",
    name: "Pizza Hut Express",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    rating: 4.5,
    reviewCount: 1203,
    deliveryTime: "30-35 นาที",
    distance: "2.0 กม.",
    tags: ["พิซซ่า", "อิตาเลียน"],
  },
];

const recommendedRestaurants = [
  {
    id: "5",
    name: "ส้มตำ นัว นัว",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400",
    rating: 4.7,
    reviewCount: 678,
    deliveryTime: "15-20 นาที",
    distance: "1.0 กม.",
    promo: "ซื้อ 1 แถม 1",
    tags: ["ส้มตำ", "อีสาน"],
  },
  {
    id: "6",
    name: "ข้าวมันไก่ประตูน้ำ",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
    rating: 4.8,
    reviewCount: 445,
    deliveryTime: "20-25 นาที",
    distance: "1.3 กม.",
    tags: ["ข้าวมันไก่", "อาหารไทย"],
  },
  {
    id: "7",
    name: "ชาบู ชาบู King",
    image: "https://images.unsplash.com/photo-1617196035303-4e6e0d37c3f0?w=400",
    rating: 4.6,
    reviewCount: 234,
    deliveryTime: "25-30 นาที",
    distance: "1.8 กม.",
    promo: "-15%",
    tags: ["ชาบู", "อาหารญี่ปุ่น"],
  },
  {
    id: "8",
    name: "Healthy Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    rating: 4.9,
    reviewCount: 167,
    deliveryTime: "15-20 นาที",
    distance: "0.5 กม.",
    tags: ["สลัด", "สุขภาพ"],
  },
];

const promoItems = [
  {
    id: "p1",
    name: "เซ็ตข้าวหน้าเนื้อพิเศษ",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    rating: 4.8,
    reviewCount: 234,
    deliveryTime: "15-20 นาที",
    distance: "0.8 กม.",
    promo: "-40%",
    tags: ["อาหารญี่ปุ่น", "ข้าวหน้าเนื้อ"],
  },
  {
    id: "p2",
    name: "ไก่ทอดเกาหลี สาขาสยาม",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400",
    rating: 4.7,
    reviewCount: 567,
    deliveryTime: "20-25 นาที",
    distance: "1.5 กม.",
    promo: "ซื้อ 2 แถม 1",
    tags: ["ไก่ทอด", "อาหารเกาหลี"],
  },
];

import { getOpenRestaurants } from "@/app/actions/customer";

export default async function HomePage() {
  const { data: restaurants } = await getOpenRestaurants();
  const activeRestaurants = restaurants || [];

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3.5 space-y-3">
          {/* Top Brand Logo Bar */}
          <div className="flex items-center justify-between">
            <Link href="/design" className="hover:opacity-90 transition-opacity">
              <ThunderLogo size="sm" />
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/design" className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/25 transition-all flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                โหมดออกแบบแบรนด์
              </Link>
            </div>
          </div>
          
          {/* Bottom Location/Actions Bar */}
          <div className="flex items-center justify-between pt-1">
            <AddressSelector />
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </button>
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Search Bar */}
        <SearchBar />

        {/* Promo Slider */}
        <PromoSlider />

        {/* Categories */}
        <section>
          <CategorySection />
        </section>

        {/* Promo Items Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                โปรโมชั่นพิเศษ
              </h2>
              <p className="text-sm text-muted-foreground">
                รายการลดราคาวันนี้
              </p>
            </div>
            <Link
              href="/promotions"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {promoItems.map((item) => (
              <RestaurantCard key={item.id} {...item} />
            ))}
          </div>
        </section>

        {/* Nearby Restaurants (Mapped from DB) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                ร้านค้าเปิดใหม่ & ใกล้ฉัน
              </h2>
              <p className="text-sm text-muted-foreground">
                ร้านอาหารที่เปิดรับออเดอร์
              </p>
            </div>
            <Link
              href="/search?filter=nearby"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeRestaurants.slice(0, 3).map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                image={restaurant.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"}
                rating={restaurant.rating || 4.5}
                reviewCount={restaurant.review_count || 10}
                deliveryTime="15-25 นาที"
                distance="1.2 กม."
                tags={["อร่อย", "ยอดฮิต"]}
                variant="horizontal"
              />
            ))}
            {activeRestaurants.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                ยังไม่มีร้านค้าเปิดรับออเดอร์
              </div>
            )}
          </div>
        </section>

        {/* Recommended Restaurants (Mapped from DB) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                ร้านค้าแนะนำ
              </h2>
              <p className="text-sm text-muted-foreground">
                คัดสรรโดยทีมงาน Thunder
              </p>
            </div>
            <Link
              href="/search?filter=recommended"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {activeRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                id={restaurant.id}
                name={restaurant.name}
                image={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                rating={restaurant.rating || 4.5}
                reviewCount={restaurant.review_count || 10}
                deliveryTime="15-25 นาที"
                distance="1.5 กม."
                tags={["ขายดี"]}
              />
            ))}
          </div>
        </section>
      </main>

      <FloatingCartButton />
      <BottomNav />
    </div>
  );
}
