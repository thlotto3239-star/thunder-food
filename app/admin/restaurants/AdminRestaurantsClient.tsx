'use client'

import { useState } from 'react'
import { verifyRestaurant, toggleRestaurantOpenStatus } from '@/app/actions/admin'
import { useToast } from '@/components/ui/use-toast'

type Restaurant = {
  id: string
  name: string
  address: string | null
  image_url: string | null
  is_open: boolean
  is_verified: boolean
  users?: { full_name: string; phone: string | null }
}

export default function AdminRestaurantsClient({
  initialPending,
  initialAll,
}: {
  initialPending: Restaurant[]
  initialAll: Restaurant[]
}) {
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [pending, setPending] = useState(initialPending)
  const [all, setAll] = useState(initialAll)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVerify = async (id: string) => {
    setLoadingId(id)
    const res = await verifyRestaurant(id)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'อนุมัติร้านค้าสำเร็จ', description: 'ร้านค้าสามารถเริ่มต้นขายได้แล้ว' })
      setPending(prev => prev.filter(r => r.id !== id))
      setAll(prev => prev.map(r => r.id === id ? { ...r, is_verified: true } : r))
    }
    setLoadingId(null)
  }

  const handleToggleOpen = async (id: string, nextOpen: boolean) => {
    setLoadingId(id)
    const res = await toggleRestaurantOpenStatus(id, nextOpen)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: nextOpen ? 'เปิดใช้งานร้านค้าแล้ว' : 'ระงับร้านค้าแล้ว' })
      setAll(prev => prev.map(r => r.id === id ? { ...r, is_open: nextOpen } : r))
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-bold font-thai transition-colors ${tab === 'pending' ? 'bg-black text-white' : 'text-gray-600'}`}
        >
          รอการอนุมัติ ({pending.length})
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-bold font-thai transition-colors ${tab === 'all' ? 'bg-black text-white' : 'text-gray-600'}`}
        >
          ร้านค้าทั้งหมด ({all.length})
        </button>
      </div>

      {tab === 'pending' && (
        <div>
          <h2 className="text-2xl font-bold font-thai mb-4">ร้านค้าที่รอการอนุมัติ</h2>
          {pending.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <p className="text-gray-500 font-thai">ไม่มีร้านค้าที่รอการอนุมัติในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map((rest) => (
                <div key={rest.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                      {rest.image_url ? (
                        <img src={rest.image_url} alt={rest.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="material-symbols-outlined">restaurant</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{rest.name}</h3>
                      <p className="text-sm text-gray-500">{rest.users?.full_name} ({rest.users?.phone || '-'})</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <strong>ที่อยู่:</strong> {rest.address || 'ไม่ได้ระบุ'}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleVerify(rest.id)}
                      disabled={loadingId === rest.id}
                      className="bg-black text-white px-6 py-2 rounded-lg font-bold font-thai hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loadingId === rest.id ? 'กำลังดำเนินการ...' : 'อนุมัติร้านค้า'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'all' && (
        <div>
          <h2 className="text-2xl font-bold font-thai mb-4">ร้านค้าทั้งหมดในระบบ</h2>
          {all.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <p className="text-gray-500 font-thai">ยังไม่มีร้านค้าในระบบ</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="p-4 font-thai">ร้านค้า</th>
                    <th className="p-4 font-thai">เจ้าของ</th>
                    <th className="p-4 font-thai">สถานะยืนยัน</th>
                    <th className="p-4 font-thai">สถานะร้าน</th>
                    <th className="p-4 font-thai text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((rest) => (
                    <tr key={rest.id} className="border-t border-gray-100">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          {rest.image_url ? (
                            <img src={rest.image_url} alt={rest.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <span className="font-bold">{rest.name}</span>
                      </td>
                      <td className="p-4 text-gray-500">{rest.users?.full_name} ({rest.users?.phone || '-'})</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${rest.is_verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                          {rest.is_verified ? 'ยืนยันแล้ว' : 'รออนุมัติ'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${rest.is_open ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {rest.is_open ? 'เปิดอยู่' : 'ระงับ/ปิด'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleOpen(rest.id, !rest.is_open)}
                          disabled={loadingId === rest.id}
                          className={`px-4 py-2 rounded-lg font-bold font-thai text-xs transition-colors disabled:opacity-50 ${rest.is_open ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                          {loadingId === rest.id ? '...' : rest.is_open ? 'ระงับร้าน' : 'เปิดใช้งาน'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
