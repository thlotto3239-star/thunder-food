'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/app/actions/auth'
import { useNotification } from '@/components/thunder/notification-popup'
import Link from 'next/link'
import { ThunderLogo } from '@/components/thunder/logo'

export default function RegisterClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState('customer')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const router = useRouter()
  const { showNotification } = useNotification()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!acceptedTerms) {
      showNotification({
        type: 'error',
        title: 'กรุณายอมรับข้อกำหนด ⚡',
        message: 'โปรดยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวก่อนสมัครสมาชิก',
        duration: 4000,
      })
      return
    }

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('role', role)
    formData.append('acceptedTerms', 'true')

    const result = await register(formData)

    if (result?.error) {
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการสมัครสมาชิก ⚡',
        message: result.error,
        duration: 4000,
      })
      setIsLoading(false)
    } else {
      showNotification({
        type: 'success',
        title: 'สมัครสมาชิกสำเร็จ! 🎉',
        message: 'ระบบกำลังพาท่านไปหน้าเข้าสู่ระบบในครู่เดียว',
        duration: 3000,
      })
      router.push('/login')
    }
  }

  return (
    <div className="bg-[#0e0e0e] text-[#f9f6f5] antialiased selection:bg-[#ffd709] selection:text-[#5b4b00] min-h-screen flex flex-col overflow-x-hidden font-body">
      <main className="flex-grow flex flex-col md:flex-row relative">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 215, 9, 0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        ></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6c5a00] opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-80 z-0"></div>
        
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-center p-16 z-10">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd709]/10 border border-[#ffd709]/20 rounded-full mb-6">
              <span className="material-symbols-outlined text-[#ffd709] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="text-[#ffd709] font-label text-xs font-bold tracking-[0.2em] uppercase">Join The Fleet</span>
            </div>
            <h1 className="font-headline font-black text-7xl lg:text-8xl italic tracking-tighter text-[#f9f6f5] leading-[0.85] mb-8">
              THUNDER<br/><span className="text-[#ffd709]">DELIVERY</span>
            </h1>
            <p className="text-[#5c5b5b] font-body text-xl max-w-md leading-relaxed opacity-70">
              เข้าร่วมเป็นส่วนหนึ่งของระบบขนส่งที่รวดเร็วที่สุด ไม่ว่าคุณจะเป็นลูกค้า ร้านค้า หรือไรเดอร์
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-4xl font-headline font-black text-[#ffd709] tracking-tighter">JOIN</span>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#afadac]">Our Platform</span>
            </div>
            <div className="w-px h-12 bg-[#afadac]/20"></div>
            <div className="flex flex-col">
              <span className="text-4xl font-headline font-black text-[#ffd709] tracking-tighter">NOW</span>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#afadac]">Get Started</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 min-h-screen bg-[#ffffff] md:rounded-l-[3rem] z-10 flex flex-col justify-center items-center px-6 py-12 shadow-[-40px_0_80px_rgba(0,0,0,0.4)]">
          <div className="w-full max-w-md">
            <div className="md:hidden flex flex-col items-center mb-10">
              <div className="flex items-center gap-2 mb-4">
                <ThunderLogo size="lg" />
              </div>
              <div className="h-1 w-12 bg-[#ffd709] rounded-full"></div>
            </div>
            
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-headline font-bold text-[#2f2f2e] mb-3 tracking-tight">สมัครสมาชิก</h2>
              <p className="text-[#5c5b5b] font-body">กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1">สมัครในฐานะ</label>
                <div className="grid grid-cols-3 gap-2 bg-[#f3f0ef] p-1.5 rounded-2xl">
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="role_selection" 
                      value="customer" 
                      className="peer sr-only" 
                      checked={role === 'customer'}
                      onChange={() => setRole('customer')}
                    />
                    <div className="flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 peer-checked:bg-[#0e0e0e] peer-checked:text-[#ffd709] text-[#5c5b5b] hover:bg-[#eae7e7]">
                      <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                      <span className="text-[11px] font-bold">ลูกค้า</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="role_selection" 
                      value="restaurant" 
                      className="peer sr-only" 
                      checked={role === 'restaurant'}
                      onChange={() => setRole('restaurant')}
                    />
                    <div className="flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 peer-checked:bg-[#0e0e0e] peer-checked:text-[#ffd709] text-[#5c5b5b] hover:bg-[#eae7e7]">
                      <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                      <span className="text-[11px] font-bold">ร้านค้า</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="role_selection" 
                      value="rider" 
                      className="peer sr-only" 
                      checked={role === 'rider'}
                      onChange={() => setRole('rider')}
                    />
                    <div className="flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 peer-checked:bg-[#0e0e0e] peer-checked:text-[#ffd709] text-[#5c5b5b] hover:bg-[#eae7e7]">
                      <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
                      <span className="text-[11px] font-bold">ไรเดอร์</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">
                    {role === 'customer' && 'ชื่อ - นามสกุล'}
                    {role === 'restaurant' && 'ชื่อร้านค้า'}
                    {role === 'rider' && 'ชื่อ - นามสกุล ไรเดอร์'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors pointer-events-none">badge</span>
                    <input 
                      name="fullName"
                      type="text" 
                      required
                      className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e]" 
                      placeholder={role === 'customer' ? 'กรอกชื่อ - นามสกุลจริงของคุณ' : role === 'restaurant' ? 'กรอกชื่อร้านค้าอย่างเป็นทางการ' : 'กรอกชื่อ - นามสกุลจริงของไรเดอร์'} 
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors pointer-events-none">phone</span>
                    <input 
                      name="phone"
                      type="tel" 
                      pattern="[0-9]{10}"
                      required
                      className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e]" 
                      placeholder="กรอกเบอร์โทรศัพท์มือถือ 10 หลัก (เช่น 08XXXXXXXX)" 
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">รหัสผ่าน</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors pointer-events-none">lock</span>
                    <input 
                      name="password"
                      type="password" 
                      required
                      minLength={6}
                      className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e]" 
                      placeholder="กำหนดรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 px-1">
                <input
                  type="checkbox"
                  id="acceptedTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#ffd709] shrink-0"
                />
                <label htmlFor="acceptedTerms" className="text-sm text-[#5c5b5b] leading-relaxed">
                  ฉันยอมรับ{' '}
                  <Link href="/terms" target="_blank" className="font-bold text-[#6c5a00] hover:underline">
                    ข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว (PDPA)
                  </Link>
                </label>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || !acceptedTerms}
                  className="w-full bg-[#ffd709] hover:bg-[#5e4e00] hover:text-[#fff2cd] text-[#453900] font-bold py-5 rounded-2xl shadow-[0_12px_24px_-8px_rgba(255,215,9,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <span>{isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}</span>
                  {!isLoading && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">trending_flat</span>}
                </button>
                
                <div className="flex items-center justify-center px-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#5c5b5b]">มีบัญชีอยู่แล้ว?</span>
                    <Link href="/login" className="text-sm font-bold text-[#6c5a00] hover:underline underline-offset-4 transition-all">เข้าสู่ระบบ</Link>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-16 flex flex-col items-center">
              <p className="text-[10px] text-[#afadac] font-label uppercase tracking-[0.2em] text-center max-w-[200px] leading-relaxed">
                Thunder Delivery Group © 2024 Kinetic Precision Logistics
              </p>
            </div>
          </div>
        </div>
        
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#6c5a00]/5 blur-[100px] -z-10 rounded-full"></div>
      </main>
    </div>
  )
}
