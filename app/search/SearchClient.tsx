"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BottomNav } from "@/components/thunder/bottom-nav";
import { CategorySection } from "@/components/thunder/category-section";
import { RestaurantCard } from "@/components/thunder/restaurant-card";
import { SearchBar } from "@/components/thunder/search-bar";
import { CartProvider } from "@/components/thunder/cart-context";
import { NotificationProvider } from "@/components/thunder/notification-popup";
import { FloatingCartButton } from "@/components/thunder/cart-sheet";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, SlidersHorizontal, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DbRestaurant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  review_count: number | null;
  is_open: boolean;
  is_verified: boolean;
}

function getRestaurantCategory(name: string, description: string = ""): string {
  const text = (name + " " + (description || "")).toLowerCase();
  
  if (text.includes("เครื่องดื่ม") || text.includes("กาแฟ") || text.includes("ชา") || text.includes("นม") || text.includes("coffee") || text.includes("tea") || text.includes("drinks")) {
    return "drinks";
  }
  if (text.includes("พิซซ่า") || text.includes("pizza") || text.includes("อิตาเลียน")) {
    return "pizza";
  }
  if (text.includes("สลัด") || text.includes("สุขภาพ") || text.includes("healthy") || text.includes("salad")) {
    return "healthy";
  }
  if (text.includes("ของหวาน") || text.includes("เค้ก") || text.includes("ไอติม") || text.includes("ไอศกรีม") || text.includes("dessert") || text.includes("cake")) {
    return "dessert";
  }
  if (text.includes("ก๋วยเตี๋ยว") || text.includes("เส้น") || text.includes("บะหมี่") || text.includes("ราเมง") || text.includes("noodles")) {
    return "noodles";
  }
  if (text.includes("เบอร์เกอร์") || text.includes("ฟาสต์ฟู้ด") || text.includes("ไก่ทอด") || text.includes("burger") || text.includes("fastfood")) {
    return "fastfood";
  }
  if (text.includes("ทะเล") || text.includes("ซีฟู้ด") || text.includes("sushi") || text.includes("ซูชิ") || text.includes("seafood") || text.includes("กุ้ง") || text.includes("ปลา")) {
    return "seafood";
  }
  return "all";
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("recommended");
  const [dbRestaurants, setDbRestaurants] = useState<DbRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRestaurants() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("is_verified", true);

        if (error) {
          console.error("Error loading restaurants:", error);
        } else if (data) {
          setDbRestaurants(data);
        }
      } catch (err) {
        console.error("Catch error loading restaurants:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const restaurantsViewModel = dbRestaurants.map((res) => {
    const category = getRestaurantCategory(res.name, res.description || "");
    const tags = [category === "all" ? "ทั่วไป" : category === "drinks" ? "เครื่องดื่ม" : category === "noodles" ? "บะหมี่เส้น" : "อาหารอร่อย"];
    
    return {
      id: res.id,
      name: res.name,
      image: res.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      rating: res.rating || 4.5,
      reviewCount: res.review_count || 12,
      deliveryTime: "15-25 นาที",
      distance: "1.2 กม.",
      promo: res.is_open ? "เปิดอยู่" : undefined,
      tags: tags,
      category: category,
      isOpen: res.is_open,
    };
  });

  const filteredRestaurants = restaurantsViewModel.filter((restaurant) => {
    const matchesQuery =
      query === "" ||
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      (restaurant.tags && restaurant.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      ));

    const matchesCategory =
      selectedCategory === "all" || restaurant.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background pb-24 font-thai">
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
            <div className="flex-1">
              <SearchBar
                defaultValue={query}
                onSearch={setQuery}
                autoFocus={!initialQuery}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Categories Carousel */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-bold">
            พบ {sortedRestaurants.length} ร้านอร่อยในพื้นที่
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs font-bold rounded-xl border-gray-250">
                <SlidersHorizontal className="w-4 h-4" />
                ตัวกรอง
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl font-thai">
              <SheetHeader>
                <SheetTitle className="font-black">จัดเรียงตามลำดับ</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 py-4">
                {[
                  { value: "recommended", label: "แนะนำสำหรับคุณ" },
                  { value: "rating", label: "คะแนนสูงสุด (รีวิว)" },
                  { value: "distance", label: "ระยะทางใกล้ที่สุด" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`p-4 rounded-2xl text-left text-sm font-bold transition-colors ${
                      sortBy === option.value
                        ? "bg-[#ffd709] text-[#1c1c1e]"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Live Restaurant Grid Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-xs text-gray-500 mt-2">กำลังดึงข้อมูลร้านอาหารล่าสุด...</p>
          </div>
        ) : sortedRestaurants.length > 0 ? (
          <div className="space-y-3">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                image={restaurant.image}
                rating={restaurant.rating}
                reviewCount={restaurant.reviewCount}
                deliveryTime={restaurant.deliveryTime}
                distance={restaurant.distance}
                promo={restaurant.promo}
                tags={restaurant.tags}
                variant="horizontal"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">ไม่พบร้านค้าในหมวดหมู่นี้</h3>
            <p className="text-xs text-muted-foreground">
              ลองพิมพ์ค้นหา หรือเลือกหมวดหมู่อื่นด้านบนนะคะ
            </p>
          </div>
        )}
      </main>

      <FloatingCartButton />
      <BottomNav />
    </div>
  );
}

export default function SearchClient() {
  return (
    <CartProvider>
      <NotificationProvider>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <SearchContent />
        </Suspense>
      </NotificationProvider>
    </CartProvider>
  );
}
