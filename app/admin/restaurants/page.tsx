export const dynamic = "force-dynamic";

import { getUnverifiedRestaurants, getAllRestaurants } from '@/app/actions/admin'
import AdminRestaurantsClient from './AdminRestaurantsClient'

export default async function AdminRestaurantsPage() {
  const [pendingRes, allRes] = await Promise.all([
    getUnverifiedRestaurants(),
    getAllRestaurants(),
  ])

  if (pendingRes.error || allRes.error) {
    return <div className="text-red-500 font-thai">ไม่สามารถโหลดข้อมูลได้: {pendingRes.error || allRes.error}</div>
  }

  return (
    <AdminRestaurantsClient
      initialPending={pendingRes.data || []}
      initialAll={allRes.data || []}
    />
  )
}
