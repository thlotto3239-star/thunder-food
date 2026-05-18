export const dynamic = "force-dynamic";

import { getRestaurantOrders } from "@/app/actions/order"
import RestaurantOrdersClient from "./RestaurantOrdersClient"

export default async function RestaurantOrdersPage() {
  const { data: orders, error } = await getRestaurantOrders()

  return <RestaurantOrdersClient initialOrders={orders || []} error={error} />
}
