export const dynamic = "force-dynamic";

import { getAvailableDeliveries, getMyDeliveries } from '@/app/actions/order'
import { getRiderProfile } from '@/app/actions/rider'
import RiderJobCard from './RiderJobCard'
import RiderRealtimeListener from './RiderRealtimeListener'
import RiderStatusToggle from './RiderStatusToggle'

export default async function RiderDashboard() {
  const [availableRes, myJobsRes, profileRes] = await Promise.all([
    getAvailableDeliveries(),
    getMyDeliveries(),
    getRiderProfile()
  ])

  const availableJobs = availableRes.data || []
  const myJobs = myJobsRes.data || []
  const profile = profileRes.data || { is_online: false }

  // Check if rider is currently on a job (picking_up or delivering)
  const currentJob = myJobs[0]

  return (
    <div className="space-y-0 relative">
      <RiderRealtimeListener />
      {/* Rider Header */}
      <div className="bg-[#2c2c2e] px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ffd709] flex items-center justify-center text-[#1c1c1e]">
              <span className="material-symbols-outlined">two_wheeler</span>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Status</p>
              <h2 className="text-white font-bold text-xl">{currentJob ? 'กำลังจัดส่ง' : 'พร้อมรับงาน'}</h2>
            </div>
          </div>
          <RiderStatusToggle initialStatus={profile.is_online} />
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {currentJob ? (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd709]">my_location</span>
              ออเดอร์ปัจจุบัน
            </h3>
            <RiderJobCard order={currentJob} isMyJob={true} />
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">งานที่พร้อมรับ ({availableJobs.length})</h3>
            </div>
            
            {availableJobs.length === 0 ? (
              <div className="text-center py-16 bg-[#2c2c2e] rounded-3xl border border-dashed border-gray-600">
                <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">radar</span>
                <p className="text-gray-400">กำลังค้นหางานในพื้นที่ของคุณ...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.map((job: any) => (
                  <RiderJobCard key={job.id} order={job} isMyJob={false} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
