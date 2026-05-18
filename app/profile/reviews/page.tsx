export const dynamic = "force-dynamic";

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProfileReviewsPage() {
  return (
    <div className="min-h-screen bg-[#f9f6f5]">
      <div className="bg-white sticky top-0 z-50 px-4 py-4 flex items-center gap-3 shadow-sm border-b">
        <Link href="/profile" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <h1 className="font-bold text-lg text-gray-900">รีวิวของฉัน</h1>
      </div>
      <div className="p-6 text-center py-20">
        <span className="text-5xl mb-4 block">⭐</span>
        <p className="font-bold text-gray-800 font-thai">ฟีเจอร์รีวิวกำลังพัฒนา</p>
        <p className="text-sm text-gray-500 mt-2">Coming soon in the next version</p>
      </div>
    </div>
  )
}
