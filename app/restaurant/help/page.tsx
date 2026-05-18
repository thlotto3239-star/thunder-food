export const dynamic = "force-dynamic";

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RestaurantHelpPage() {
  const faqs = [
    { q: 'ทำไมออเดอร์ถึงไม่มาถึงร้าน?', a: 'ตรวจสอบว่าร้านของคุณเปิดรับออเดอร์อยู่ใน Toggle สถานะร้าน หน้าโปรไฟล์' },
    { q: 'วิธีเพิ่มเมนูใหม่?', a: 'ไปที่ เมนู → กด + เพิ่มเมนูใหม่ → กรอกชื่อ ราคา และอัปโหลดรูปภาพ' },
    { q: 'ชำระเงินจากระบบเมื่อไหร่?', a: 'ระบบจะโอนรายได้ทุกสิ้นสัปดาห์ ตามบัญชีที่ผูกไว้ในตั้งค่า' },
    { q: 'จะปิดร้านชั่วคราวได้อย่างไร?', a: 'ไปที่ โปรไฟล์ร้าน → สลับ Toggle สถานะร้านเป็นปิด' },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/restaurant/profile" className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black font-headline text-[#0e0e0e]">ช่วยเหลือ</h1>
          <p className="text-sm text-gray-500">Help & Support</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-gray-700 font-thai">คำถามที่พบบ่อย (FAQ)</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="font-bold text-gray-800 font-thai text-sm">❓ {faq.q}</p>
            <p className="text-gray-600 text-sm mt-2 font-thai leading-relaxed">💡 {faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#ffd709]/10 border border-[#ffd709]/30 rounded-2xl p-4">
        <p className="font-bold text-[#6c5a00] font-thai text-sm">📞 ติดต่อทีมงาน</p>
        <p className="text-gray-600 text-sm mt-1">Line OA: @ThunderFood | Email: support@thunderfood.co.th</p>
      </div>
    </div>
  )
}
