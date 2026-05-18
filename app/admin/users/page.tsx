export const dynamic = "force-dynamic";

import { getAllUsers } from '@/app/actions/admin'
import AdminUsersClient from './AdminUsersClient'

export default async function AdminUsersPage() {
  const { data, error } = await getAllUsers()
  
  if (error) {
    return <div className="text-red-500 font-thai">ไม่สามารถโหลดข้อมูลได้: {error}</div>
  }

  return <AdminUsersClient initialUsers={data || []} />
}
