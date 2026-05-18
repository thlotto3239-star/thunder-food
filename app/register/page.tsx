export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const RegisterClient = dynamicImport(() => import("./RegisterClient"));

export default function RegisterPage() {
  return <RegisterClient />;
}
