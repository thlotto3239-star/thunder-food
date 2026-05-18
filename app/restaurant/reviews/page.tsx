export const dynamic = "force-dynamic";

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RestaurantReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/restaurant/profile" className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black font-headline text-[#0e0e0e]">รีวิวจากลูกค้า</h1>
          <p className="text-sm text-gray-500">Customer Reviews</p>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-3 block">⭐</span>
        <p className="font-bold font-thai text-amber-800">ฟีเจอร์รีวิวกำลังพัฒนา</p>
        <p className="text-sm text-amber-600 mt-1">ระบบจะรองรับการแสดงผลรีวิวลูกค้าในเวอร์ชันถัดไป</p>
      </div>
    </div>
  )
}
