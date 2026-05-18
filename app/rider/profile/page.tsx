export const dynamic = "force-dynamic";

import { getRiderProfile } from "@/app/actions/rider"
import RiderProfileClient from "./RiderProfileClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/uglyos/bottom-nav"

export default async function RiderProfilePage() {
  const { data, error } = await getRiderProfile()

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-xl font-bold mb-4 font-thai">ไม่พบข้อมูลผู้ขับขี่</h1>
        <p className="text-sm text-gray-500 mb-6 font-thai">{error}</p>
        <Link href="/">
          <Button>กลับหน้าหลัก</Button>
        </Link>
        <BottomNav role="rider" />
      </div>
    )
  }

  return <RiderProfileClient profile={data} />
}
