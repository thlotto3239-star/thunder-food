"use client";

import RiderStubLayout from '@/app/rider/RiderStubLayout'

const faqs = [
  { q: 'วิธีเริ่มรับงาน?', a: 'กดปุ่ม Toggle "ออนไลน์" ที่หน้า Dashboard จากนั้นออเดอร์ที่พร้อมส่งจะแสดงขึ้นมา' },
  { q: 'ถ้าไม่สามารถรับงานได้?', a: 'กด "ปฏิเสธ" ออเดอร์นั้น ระบบจะส่งให้ไรเดอร์คนอื่นโดยอัตโนมัติ' },
  { q: 'รายได้จะโอนเมื่อไหร่?', a: 'ทุกวันจันทร์ ระบบจะรวบรวมรายได้สัปดาห์ที่ผ่านมาและโอนให้ภายใน 2 วันทำการ' },
  { q: 'มีปัญหาระหว่างส่ง?', a: 'กดปุ่ม SOS ในหน้างานที่กำลังส่ง ระบบจะแจ้งทีมงานทันที' },
]

export default function RiderHelpPage() {
  return (
    <RiderStubLayout title="ช่วยเหลือ" titleEn="Help & Support" emoji="🆘">
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#2c2c2e] rounded-2xl p-4 border border-white/5">
            <p className="text-white font-bold text-sm">❓ {faq.q}</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">💡 {faq.a}</p>
          </div>
        ))}
        <div className="bg-[#ffd709]/10 border border-[#ffd709]/20 rounded-2xl p-4">
          <p className="text-[#ffd709] font-bold text-sm">📞 ติดต่อทีมงาน</p>
          <p className="text-gray-400 text-sm mt-1">Line: @ThunderRider | โทร: 02-XXX-XXXX</p>
        </div>
      </div>
    </RiderStubLayout>
  )
}
