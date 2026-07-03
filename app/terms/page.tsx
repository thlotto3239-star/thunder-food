import Link from 'next/link'

export const metadata = {
  title: 'ข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว - Thunder Food',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12 font-thai text-[#2f2f2e]">
        <Link href="/register" className="text-sm font-bold text-[#6c5a00] hover:underline">← กลับไปหน้าสมัครสมาชิก</Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">ข้อกำหนดการใช้งาน และนโยบายความเป็นส่วนตัว</h1>
        <p className="text-sm text-gray-500 mb-8">Thunder Food — ปรับปรุงล่าสุด 2026</p>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">1. การใช้บริการ</h2>
          <p className="text-gray-700 leading-relaxed">
            Thunder Food เป็นแพลตฟอร์มตัวกลางเชื่อมต่อลูกค้า ร้านอาหาร และไรเดอร์ เพื่ออำนวยความสะดวกในการสั่งและจัดส่งอาหาร
            ผู้ใช้ต้องให้ข้อมูลที่ถูกต้องและเป็นจริงในการลงทะเบียน และรับผิดชอบต่อการใช้งานบัญชีของตนเอง
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">2. ข้อมูลที่จัดเก็บและวัตถุประสงค์ (PDPA)</h2>
          <p className="text-gray-700 leading-relaxed">
            เราจัดเก็บ ชื่อ-นามสกุล เบอร์โทรศัพท์ ที่อยู่จัดส่ง และพิกัด GPS เพื่อวัตถุประสงค์ในการดำเนินการสั่งซื้อ จัดส่งอาหาร
            แจ้งเตือนสถานะคำสั่งซื้อ และปรับปรุงคุณภาพบริการเท่านั้น ข้อมูลจะถูกเปิดเผยให้กับคู่ค้าที่เกี่ยวข้องกับคำสั่งซื้อนั้น
            (ร้านอาหาร/ไรเดอร์) เท่าที่จำเป็นต่อการให้บริการ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
          </p>
          <p className="text-gray-700 leading-relaxed">
            ผู้ใช้มีสิทธิ์ขอเข้าถึง แก้ไข หรือขอให้ลบข้อมูลส่วนบุคคลของตนเองได้ โดยติดต่อผ่านช่องทางฝ่ายบริการลูกค้าในแอปพลิเคชัน
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">3. การชำระเงิน</h2>
          <p className="text-gray-700 leading-relaxed">
            บริการรองรับการชำระเงินปลายทาง (เงินสด) และการโอนเงิน ผู้ใช้ต้องตรวจสอบยอดเงินให้ถูกต้องก่อนยืนยันคำสั่งซื้อทุกครั้ง
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">4. ข้อจำกัดความรับผิดชอบ</h2>
          <p className="text-gray-700 leading-relaxed">
            Thunder Food เป็นผู้ให้บริการแพลตฟอร์มเทคโนโลยี ไม่ใช่ผู้ผลิตหรือจำหน่ายอาหารโดยตรง จึงไม่รับผิดชอบต่อคุณภาพอาหาร
            ความล่าช้าในการจัดส่งที่เกิดจากปัจจัยภายนอก หรือข้อพิพาทระหว่างผู้ใช้กับร้านค้า/ไรเดอร์โดยตรง
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">5. การยกเลิก/ระงับบัญชี</h2>
          <p className="text-gray-700 leading-relaxed">
            แพลตฟอร์มขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีผู้ใช้ที่ละเมิดข้อกำหนด ใช้งานในทางทุจริต หรือก่อความเสียหายต่อผู้ใช้รายอื่น
          </p>
        </section>

        <p className="text-xs text-gray-400 mt-12">
          เอกสารฉบับนี้เป็นข้อกำหนดเบื้องต้นสำหรับการเปิดให้บริการ ควรให้ที่ปรึกษากฎหมายตรวจสอบก่อนเปิดใช้งานเชิงพาณิชย์เต็มรูปแบบ
        </p>
      </div>
    </div>
  )
}
