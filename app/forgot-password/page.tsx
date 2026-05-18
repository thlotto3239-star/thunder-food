export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const ForgotPasswordClient = dynamicImport(
  () => import("./ForgotPasswordClient")
);

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
