export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const PromotionsClient = dynamicImport(() => import("./PromotionsClient"));

export default function PromotionsPage() {
  return <PromotionsClient />;
}
