export const dynamic = "force-dynamic";

import { getUnverifiedRestaurants } from '@/app/actions/admin'
import AdminRestaurantsClient from './AdminRestaurantsClient'

export default async function AdminRestaurantsPage() {
  const { data, error } = await getUnverifiedRestaurants()
  
  if (error) {
    return <div className="text-red-500 font-thai">ไม่สามารถโหลดข้อมูลได้: {error}</div>
  }

  return <AdminRestaurantsClient initialRestaurants={data || []} />
}
