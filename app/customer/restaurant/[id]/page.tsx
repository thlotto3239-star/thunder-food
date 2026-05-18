export const dynamic = "force-dynamic";

import { createClient } from '@/utils/supabase/server'
import CustomerMenu from './CustomerMenu'
import RestaurantHeaderActions from './RestaurantHeaderActions'

export default async function RestaurantMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Fetch restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()

  if (!restaurant) {
    return <div className="p-8 text-center">ไม่พบร้านอาหาร</div>
  }

  // Fetch items with categories
  const { data: items } = await supabase
    .from('menu_items')
    .select('*, menu_categories(name, sort_order)')
    .eq('restaurant_id', id)
    .eq('is_available', true)
    .order('sort_order', { referencedTable: 'menu_categories' })

  // Check if restaurant is favorited by the current user
  const { data: { user } } = await supabase.auth.getUser()
  let isFavorite = false
  if (user) {
    const { data: fav } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('restaurant_id', id)
      .maybeSingle()
    isFavorite = !!fav
  }

  // Deduplicate categories from items
  const categoriesMap = new Map()
  if (items) {
    items.forEach(item => {
      if (item.menu_categories) {
        categoriesMap.set(item.category_id, item.menu_categories.name)
      }
    })
  }
  const categories = Array.from(categoriesMap.values())

  return (
    <div className="bg-[#f9f6f5] min-h-screen pb-32 font-sans">
      {/* Header / Cover */}
      <div className="h-64 bg-gray-300 relative">
        {restaurant.image_url ? (
          <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-200 to-orange-200" />
        )}
        
        {/* Top Navbar Actions */}
        <RestaurantHeaderActions 
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          initialIsFavorite={isFavorite}
        />

        {/* Status Badge */}
        {restaurant.is_open && (
          <div className="absolute bottom-6 left-6 z-10">
            <div className="bg-[#00c950] text-white px-3 py-1 rounded-full text-xs font-bold inline-block shadow-sm">
              เปิดอยู่
            </div>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="bg-white rounded-t-[2rem] -mt-4 relative z-20 p-6 shadow-sm">
        <h1 className="font-headline text-3xl font-black text-gray-900">{restaurant.name}</h1>
        <p className="text-gray-500 font-bold mt-1 text-sm">Somtam Sakon</p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
            <span className="material-symbols-outlined text-[16px] text-gray-300" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            {restaurant.rating || '0.0'} <span className="text-gray-400 font-normal">({restaurant.review_count || 0} รีวิว)</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            15-25 นาที
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            1.2 km
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4 leading-relaxed">{restaurant.description || 'ไม่มีคำอธิบายร้าน'}</p>
        
        {/* Tags */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {['อาหารอีสาน', 'ส้มตำ', 'ไก่ย่าง'].map((tag, i) => (
            <span key={i} className="px-3 py-1 rounded-full border border-gray-200 text-gray-600 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Delivery Info Box */}
        <div className="mt-6 bg-[#f8f8f8] rounded-2xl p-4 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">ค่าจัดส่ง:</span>
              <span className="font-bold text-gray-900">฿25</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">สั่งขั้นต่ำ:</span>
              <span className="font-bold text-gray-900">฿50</span>
            </div>
          </div>
          <a href="tel:021234567" className="flex items-center gap-1 text-gray-700 font-bold text-sm hover:opacity-80 active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined text-[20px]">call</span> โทร
          </a>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 py-2 mt-2">
        <CustomerMenu restaurantId={restaurant.id} restaurantName={restaurant.name} items={items || []} categories={categories} />
      </div>
    </div>
  )
}
