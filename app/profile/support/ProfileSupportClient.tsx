"use client";

import Link from 'next/link'
import { ArrowLeft, MessageCircle, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  { q: 'ออเดอร์ของฉันอยู่ที่ไหน?', a: 'ไปที่ ออเดอร์ → เลือกออเดอร์ที่ต้องการ → จะเห็นสถานะและตำแหน่งไรเดอร์ Real-time' },
  { q: 'วิธียกเลิกออเดอร์?', a: 'สามารถยกเลิกได้ภายใน 2 นาทีหลังสั่ง โดยไปที่รายละเอียดออเดอร์แล้วกดยกเลิก' },
  { q: 'ขอเงินคืนได้อย่างไร?', a: 'ติดต่อ Support ภายใน 24 ชั่วโมง ทีมงานจะดำเนินการคืนเงินภายใน 3-5 วันทำการ' },
  { q: 'ร้านปิดแต่รับออเดอร์?', a: 'ระบบจะตรวจสอบสถานะร้านก่อนยืนยัน หากร้านปิด ออเดอร์จะถูกยกเลิกอัตโนมัติ' },
]

export default function ProfileSupportClient() {
  const [toastMessage, setToastMessage] = useState("")

  const handleChat = () => {
    setToastMessage("💬 เชื่อมต่อ Live Support ของทีมงานสำเร็จ! (LINE ID: @thunderfood)")
    setTimeout(() => setToastMessage(""), 4000)
  }

  const handlePhone = () => {
    window.location.href = "tel:021234567"
  }

  const handleEmail = () => {
    window.location.href = "mailto:support@thunderfood.com?subject=Thunder%20Food%20Support"
  }

  return (
    <div className="min-h-screen bg-[#f9f6f5] pb-12">
      <div className="bg-white sticky top-0 z-50 px-4 py-4 flex items-center gap-3 shadow-sm border-b">
        <Link href="/profile" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <h1 className="font-bold text-lg text-gray-900 font-thai">ช่วยเหลือ</h1>
      </div>

      {toastMessage && (
        <div className="mx-4 mt-4 bg-gray-900 text-white rounded-xl p-3 text-xs font-semibold text-center font-thai shadow-lg animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Contact Channels */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={handleChat} 
            className="bg-green-100 text-green-700 rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <MessageCircle className="h-6 w-6 animate-pulse" />
            <span className="text-xs font-bold font-thai">Chat LINE</span>
          </button>
          
          <button 
            onClick={handlePhone} 
            className="bg-blue-100 text-blue-700 rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <Phone className="h-6 w-6" />
            <span className="text-xs font-bold font-thai">โทร 02-123-4567</span>
          </button>

          <button 
            onClick={handleEmail} 
            className="bg-amber-100 text-amber-700 rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <Mail className="h-6 w-6" />
            <span className="text-xs font-bold font-thai">อีเมล Support</span>
          </button>
        </div>

        <h2 className="font-bold text-gray-700 font-thai">คำถามที่พบบ่อย (FAQs)</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="font-bold text-gray-800 font-thai text-sm">❓ {faq.q}</p>
            <p className="text-gray-600 text-sm mt-2 font-thai leading-relaxed">💡 {faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
