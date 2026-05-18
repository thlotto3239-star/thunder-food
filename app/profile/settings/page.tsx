export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const ProfileSettingsClient = dynamicImport(
  () => import("./ProfileSettingsClient")
);

export default function ProfileSettingsPage() {
  return <ProfileSettingsClient />;
}
