import { stripe } from "@/lib/stripe";
import { redirect } from "@remix-run/node";

export async function subscribed(stripeId: string) {
  const customerStripe = await stripe.customers.retrieve(stripeId, {
    expand: ["subscriptions"],
  });
  const subscriptions = customerStripe as any;
  const subscription = subscriptions["subscriptions"]["data"][0];

  if (!subscription) {
    throw redirect("/checkout");
  }
}
