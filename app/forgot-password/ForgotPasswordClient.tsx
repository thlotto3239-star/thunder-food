'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Phone, CheckCircle } from 'lucide-react'

export default function ForgotPasswordClient() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resolvedEmail, setResolvedEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return
    
    setLoading(true)
    setError('')

    const formattedEmail = username.includes('@') 
      ? username.trim() 
      : `${username.trim().toLowerCase()}@thunder-food.com`
    
    setResolvedEmail(formattedEmail)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(formattedEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile/settings`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffd709] to-[#f5c800] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-black text-4xl italic tracking-tighter text-[#0e0e0e]">
            THUNDER<span className="text-white drop-shadow-md">FOOD</span>
          </h1>
          <p className="text-[#6c5a00] font-bold mt-2 text-sm font-thai">ลืมรหัสผ่าน?</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 font-thai">
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900">รีเซ็ตรหัสผ่าน</h2>
                <p className="text-gray-500 text-sm mt-1">กรอกเบอร์โทรศัพท์ที่ใช้สมัครเพื่อกู้คืนรหัสผ่าน</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1.5">
                    เบอร์โทรศัพท์
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="username"
                      type="tel"
                      pattern="[0-9]{10}"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="08xxxxxxxx"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd709] focus:border-transparent transition-all text-sm text-[#0e0e0e]"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1.5 block">ระบบกู้คืนผ่านบัญชีจำลองของ Thunder Delivery</span>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                    {error === 'User not found' ? 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' : error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ffd709] text-[#0e0e0e] font-black py-3 rounded-xl hover:bg-[#e5c108] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm"
                >
                  {loading ? 'กำลังส่ง...' : 'ส่งคำขอรีเซ็ตรหัสผ่าน'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-black text-gray-900">ส่งคำขอแล้ว!</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                ระบบได้จำลองลิงก์กู้คืนส่งไปยังอีเมลเสมือนของคุณ:<br/>
                <strong className="text-gray-900 block mt-1 break-all bg-gray-50 p-2 rounded-xl border border-gray-100 text-xs font-mono">{resolvedEmail}</strong>
              </p>
              <p className="text-gray-400 text-xs mt-3 leading-relaxed">ลิงก์จะทำงานผ่านหน้า Callback ของ Supabase เพื่อพาไปยังหน้าตั้งค่าใหม่</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้า Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
