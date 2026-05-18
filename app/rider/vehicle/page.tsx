"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRiderProfile, updateRiderVehicle } from '@/app/actions/rider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Bike, Save, Loader2, FileSpreadsheet } from 'lucide-react'

export default function RiderVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState('')
  const [licensePlate, setLicensePlate] = useState('')

  // Fetch initial profile values on load
  useEffect(() => {
    async function loadVehicleDetails() {
      try {
        const res = await getRiderProfile()
        if (res.data) {
          setVehicleInfo(res.data.vehicle_info || '')
          setLicensePlate(res.data.license_plate || '')
        }
      } catch (err: any) {
        console.error("Failed to load vehicle profile:", err)
      } finally {
        setLoading(false)
      }
    }
    loadVehicleDetails()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateRiderVehicle(vehicleInfo, licensePlate)
      if (res.error) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: res.error,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'บันทึกสำเร็จ',
          description: 'ข้อมูลยานพาหนะของคุณถูกอัปเดตเรียบร้อยแล้ว',
        })
        router.refresh()
      }
    } catch (err: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.message || 'ไม่สามารถบันทึกข้อมูลได้',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white font-thai pb-12">
      
      {/* Header Bar */}
      <div className="bg-[#2c2c2e] px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-[#3c3c3e] rounded-xl flex items-center justify-center hover:bg-[#4c4c4e] transition-colors active:scale-95 duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Vehicle Info</p>
            <h2 className="text-white font-bold text-xl">ข้อมูลยานพาหนะ</h2>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-[#ffd709] animate-spin" />
            <p className="text-gray-400 text-sm">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Visual Icon card */}
            <div className="bg-gradient-to-br from-[#ffd709]/10 to-amber-500/5 rounded-3xl p-6 border border-[#ffd709]/20 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-[#ffd709] text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Bike className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-white">ยานพาหนะผู้ขับขี่</h3>
              <p className="text-xs text-gray-400 mt-1">กรอกข้อมูลให้ถูกต้องเพื่อแสดงแก่ลูกค้าและร้านค้า</p>
            </div>

            {/* Inputs Panel */}
            <div className="bg-[#2c2c2e] rounded-3xl p-6 border border-white/5 space-y-5">
              
              {/* Vehicle Model Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ยี่ห้อและรุ่นรถ</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🏍️</span>
                  <input
                    type="text"
                    required
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                    placeholder="ตัวอย่าง: Honda Wave 110i (สีแดง-ดำ)"
                    className="w-full bg-[#1c1c1e] text-white rounded-2xl py-3.5 pl-11 pr-4 border border-white/10 focus:border-[#ffd709] outline-none text-sm transition-all focus:ring-1 focus:ring-[#ffd709]"
                  />
                </div>
              </div>

              {/* License Plate Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ป้ายทะเบียน</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔢</span>
                  <input
                    type="text"
                    required
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="ตัวอย่าง: 1กข 1234 กรุงเทพฯ"
                    className="w-full bg-[#1c1c1e] text-white rounded-2xl py-3.5 pl-11 pr-4 border border-white/10 focus:border-[#ffd709] outline-none text-sm transition-all focus:ring-1 focus:ring-[#ffd709]"
                  />
                </div>
              </div>

            </div>

            {/* CTA Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#ffd709] hover:bg-yellow-500 disabled:opacity-60 text-gray-900 py-4 font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-transform duration-150"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 stroke-[2.5px]" />
                  บันทึกข้อมูลยานพาหนะ
                </>
              )}
            </button>

          </form>
        )}
      </div>

    </div>
  )
}
