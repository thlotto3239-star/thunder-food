export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const AdminSettingsClient = dynamicImport(() => import("./AdminSettingsClient"));

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}
