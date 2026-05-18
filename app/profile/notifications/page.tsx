export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const ProfileNotificationsClient = dynamicImport(
  () => import("./ProfileNotificationsClient")
);

export default function ProfileNotificationsPage() {
  return <ProfileNotificationsClient />;
}
