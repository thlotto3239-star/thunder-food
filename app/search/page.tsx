export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const SearchClient = dynamicImport(() => import("./SearchClient"));

export default function SearchPage() {
  return <SearchClient />;
}
