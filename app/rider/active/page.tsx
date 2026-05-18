export const dynamic = "force-dynamic";

import { getMyDeliveries } from "@/app/actions/order"
import ActiveDeliveryClient from "./ActiveDeliveryClient"

export default async function RiderActivePage() {
  const { data: initialOrders, error } = await getMyDeliveries()
  
  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading deliveries: {error}</div>
  }

  return <ActiveDeliveryClient initialOrders={initialOrders || []} />
}
