export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const LoginClient = dynamicImport(() => import("./LoginClient"));

export default function LoginPage() {
  return <LoginClient />;
}
