export const dynamic = "force-dynamic";

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserAddresses } from "@/app/actions/customer"
import ProfileAddressesClient from "./ProfileAddressesClient"
import { BottomNav } from "@/components/thunder/bottom-nav"

export default async function AddressesPage() {
  const { data, error } = await getUserAddresses()

  return (
    <div className="min-h-screen bg-[#f9f6f5] pb-36">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto flex max-w-md items-center gap-4 px-4 py-3">
          <Link href="/profile">
            <Button size="icon" variant="ghost" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-thai text-gray-900">ที่อยู่จัดส่ง</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        {error ? (
          <div className="text-red-500 font-thai text-center py-8">เกิดข้อผิดพลาด: {error}</div>
        ) : (
          <ProfileAddressesClient initialAddresses={data || []} />
        )}
      </main>

      <BottomNav />
    </div>
  )
}

