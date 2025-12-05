import { requireUser } from "@/lib/auth";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const user = await requireUser();
  const plan = searchParams.plan || "monthly";

  return <CheckoutClient user={user} plan={plan} />;
}
