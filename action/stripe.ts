import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export type subscriptionStatus = Stripe.Subscription.Status | null;
export type subscribedStatus = "active" | "trialing";
export type notSubscribedStatus =
  | null
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "unpaid";

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
