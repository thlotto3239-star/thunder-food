export const dynamic = "force-dynamic";

import { getUserAddresses, getPaymentMethods } from "@/app/actions/customer"
import CheckoutClient from "./CheckoutClient"

export default async function CheckoutPage() {
  const { data: addresses, error: addressError } = await getUserAddresses()
  const { data: payments, error: paymentError } = await getPaymentMethods()

  if (addressError || paymentError) {
    return <div className="p-4 text-red-500">Error loading checkout data</div>
  }

  return <CheckoutClient addresses={addresses || []} payments={payments || []} />
}
