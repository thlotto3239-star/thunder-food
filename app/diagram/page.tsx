export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const DiagramClient = dynamicImport(() => import("./DiagramClient"));

export default function DiagramPage() {
  return <DiagramClient />;
}
