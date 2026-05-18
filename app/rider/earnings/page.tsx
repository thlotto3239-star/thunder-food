export const dynamic = "force-dynamic";

import { getMyEarnings } from "@/app/actions/order"
import RiderEarningsClient from "./RiderEarningsClient"

export default async function RiderEarningsPage() {
  const { data: earnings, error } = await getMyEarnings()
  
  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading earnings: {error}</div>
  }

  return <RiderEarningsClient earnings={earnings || []} />
}
