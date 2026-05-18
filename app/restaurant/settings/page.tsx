export const dynamic = "force-dynamic";

import { getRestaurantProfile } from '@/app/actions/restaurant'
import RestaurantSettingsForm from './RestaurantSettingsForm'

export default async function RestaurantSettingsPage() {
  const profile = await getRestaurantProfile()

  return (
    <div className="space-y-6">
      <div>
        <p className="font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">Store Configuration</p>
        <h2 className="font-headline text-3xl font-black tracking-tight font-thai">ตั้งค่าร้านค้า</h2>
        <p className="text-[#5c5b5b] font-thai text-sm mt-2">จัดการข้อมูลพื้นฐานและสถานะการเปิด-ปิดร้านของคุณ</p>
      </div>

      <div className="bg-[#ffffff] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <RestaurantSettingsForm initialProfile={profile} />
      </div>
    </div>
  )
}
