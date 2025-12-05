import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const user = await getCurrentUser();
  const plan = searchParams.plan || "monthly";

  if (!user) {
    redirect(`/signup?plan=${plan}`);
  }

  return <CheckoutClient user={user} plan={plan} />;
}
