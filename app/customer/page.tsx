export const dynamic = "force-dynamic";

import { AddressSelector } from "@/components/thunder/address-selector"
import { BottomNav } from "@/components/thunder/bottom-nav"
import { CartSheet, FloatingCartButton } from "@/components/thunder/cart-sheet"
import { CategorySection } from "@/components/thunder/category-section"
import { PromoSlider } from "@/components/thunder/promo-slider"
import { RestaurantCard } from "@/components/thunder/restaurant-card"
import { SearchBar } from "@/components/thunder/search-bar"
import { getOpenRestaurants } from "@/app/actions/customer"
import { Bell, ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function CustomerPage() {
  const { data: restaurants } = await getOpenRestaurants()
  const activeRestaurants = restaurants || []

  return (
    <div className="min-h-screen bg-background pb-36 font-thai">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <AddressSelector />
            <div className="flex items-center gap-2">
              <Link 
                href="/profile/notifications" 
                className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </Link>
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Search Bar */}
        <SearchBar />

        {/* Dynamic Banners Promo Slider */}
        <PromoSlider />

        {/* Categories Section */}
        <section>
          <CategorySection />
        </section>

        {/* Nearby Restaurants (Mapped from DB) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                ร้านอร่อยแนะนำใกล้คุณ 📍
              </h2>
              <p className="text-xs text-muted-foreground font-bold">
                เมนูรสเด็ดพร้อมส่งจากเตาร้อนๆ
              </p>
            </div>
            <Link
              href="/search?filter=nearby"
              className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {activeRestaurants.slice(0, 4).map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                image={restaurant.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"}
                rating={restaurant.rating || 4.8}
                reviewCount={restaurant.review_count || 12}
                deliveryTime="15-25 นาที"
                distance="1.2 กม."
                tags={["ยอดนิยม", "ส่งไว"]}
                variant="horizontal"
              />
            ))}
            
            {activeRestaurants.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400 font-bold">
                ยังไม่มีร้านค้าเปิดให้บริการในพื้นที่ของคุณ
              </div>
            )}
          </div>
        </section>

        {/* Grid of All Restaurants (2 columns layout) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                ร้านค้าทั้งหมด 🛍️
              </h2>
              <p className="text-xs text-muted-foreground font-bold">
                เลือกซื้ออาหารตามความชอบของคุณ
              </p>
            </div>
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
                tags={["แนะนำ"]}
              />
            ))}
          </div>
        </section>
      </main>

      <FloatingCartButton />
      <BottomNav />
    </div>
  )
}
