'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { useNotification } from '@/components/thunder/notification-popup'
import Link from 'next/link'
import { ThunderLogo } from '@/components/thunder/logo'

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState('customer')
  const router = useRouter()
  const { showNotification } = useNotification()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('role', role)

    const result = await login(formData)

    if (result?.error) {
      showNotification({
        type: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ ⚡',
        message: result.error,
        duration: 4000,
      })
      setIsLoading(false)
    } else {
      showNotification({
        type: 'success',
        title: 'เข้าสู่ระบบสำเร็จ! 🎉',
        message: 'ระบบกำลังนำทางคุณเข้าสู่แดชบอร์ด...',
        duration: 3000,
      })
      if (role === 'customer') router.push('/customer')
      else if (role === 'restaurant') router.push('/restaurant')
      else if (role === 'rider') router.push('/rider')
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
              <span className="text-[#ffd709] font-label text-xs font-bold tracking-[0.2em] uppercase">High Velocity Logistics</span>
            </div>
            <h1 className="font-headline font-black text-7xl lg:text-8xl italic tracking-tighter text-[#f9f6f5] leading-[0.85] mb-8">
              THUNDER<br/><span className="text-[#ffd709]">DELIVERY</span>
            </h1>
            <p className="text-[#5c5b5b] font-body text-xl max-w-md leading-relaxed opacity-70">
              สัมผัสความเร็วเหนือระดับ กับการขนส่งที่แม่นยำดุจนาฬิกาหรู ทุกคำสั่งซื้อคือภารกิจสำคัญของเรา
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-4xl font-headline font-black text-[#ffd709] tracking-tighter">15 MIN</span>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#afadac]">Average Delivery</span>
            </div>
            <div className="w-px h-12 bg-[#afadac]/20"></div>
            <div className="flex flex-col">
              <span className="text-4xl font-headline font-black text-[#ffd709] tracking-tighter">100%</span>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#afadac]">Precision Rate</span>
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
              <h2 className="text-4xl font-headline font-bold text-[#2f2f2e] mb-3 tracking-tight">เข้าสู่ระบบ</h2>
              <p className="text-[#5c5b5b] font-body">เข้าถึงระบบการขนส่งที่รวดเร็วที่สุดในพริบตา</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1">เลือกประเภทผู้ใช้งาน</label>
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
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors pointer-events-none">phone</span>
                    <input 
                      name="phone"
                      type="tel"
                      pattern="[0-9]{10}"
                      required
                      className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e]" 
                      placeholder="กรอกเบอร์โทรศัพท์มือถือ 10 หลัก" 
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
                      className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e]" 
                      placeholder="ระบุรหัสผ่านของคุณ" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#ffd709] hover:bg-[#5e4e00] hover:text-[#fff2cd] text-[#453900] font-bold py-5 rounded-2xl shadow-[0_12px_24px_-8px_rgba(255,215,9,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
                  {!isLoading && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">trending_flat</span>}
                </button>
                
                <div className="flex items-center justify-between px-2 pt-2">
                  <Link href="/forgot-password" className="text-sm font-medium text-[#5c5b5b] hover:text-[#2f2f2e] transition-colors">ลืมรหัสผ่าน?</Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#5c5b5b]">ยังไม่มีบัญชี?</span>
                    <Link href="/register" className="text-sm font-bold text-[#6c5a00] hover:underline underline-offset-4 transition-all">สมัครสมาชิก</Link>
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
