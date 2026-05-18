export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const ProfileSupportClient = dynamicImport(
  () => import("./ProfileSupportClient")
);

export default function ProfileSupportPage() {
  return <ProfileSupportClient />;
}
