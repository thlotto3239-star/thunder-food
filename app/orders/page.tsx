export const dynamic = "force-dynamic";

import Link from "next/link";
import { BottomNav } from "@/components/thunder/bottom-nav";
import { ArrowLeft } from "lucide-react";
import OrderList from "./OrderList";
import { getCustomerOrders } from "@/app/actions/order";

export default async function OrdersPage() {
  const { data: orders } = await getCustomerOrders();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg font-thai">คำสั่งซื้อของฉัน</h1>
          </div>
        </div>
      </header>

      <OrderList initialOrders={orders || []} />

      <BottomNav />
    </div>
  );
}
