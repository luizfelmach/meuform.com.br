import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "@remix-run/node";
import Stripe from "stripe";

export type subscriptionStatus = Stripe.Subscription.Status | null;

export async function getSubscriptionStatus(
  id: string
): Promise<subscriptionStatus> {
  const customer = await prisma.customer.findFirst({
    where: { id },
  });
  if (!customer) return null;
  if (!customer.subscriptionId) return null;
  const subscription = await stripe.subscriptions.retrieve(
    customer.subscriptionId
  );
  return subscription.status;
}

export async function subscribed(id: string) {
  const subscriptionStatus = await getSubscriptionStatus(id);

  const redirectStatus = [
    null,
    "canceled",
    "incomplete",
    "incomplete_expired",
    "past_due",
    "paused",
    "unpaid",
  ];

  const isRedirect = redirectStatus.includes(subscriptionStatus);

  if (isRedirect) {
    throw redirect("/checkout");
  }
}
