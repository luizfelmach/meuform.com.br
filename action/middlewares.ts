import { redirect } from "@remix-run/node";
import { getSubscriptionStatus } from "./stripe";
import { commitSession, getSession } from "@/lib/session";
import { flashError, flashRedirect } from "./session";

export async function ensureSubscribed(id: string) {
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

  const mustRedirect = redirectStatus.includes(subscriptionStatus);

  if (mustRedirect) {
    throw redirect("/checkout");
  }
}

export async function ensureNotSubscribed(id: string) {
  const subscriptionStatus = await getSubscriptionStatus(id);

  if (!subscriptionStatus) return;

  const redirectStatus = ["active", "trialing"];

  const mustRedirect = redirectStatus.includes(subscriptionStatus);

  if (mustRedirect) {
    throw redirect("/billing");
  }

  return { subscriptionStatus };
}

export async function ensureAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("id");

  if (!id) {
    flashError(session, "Você precisa se autenticar primeiro.");
    flashRedirect(session, request.url);

    throw redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  return { session, id };
}

export async function ensureNotAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("id");

  if (!!id) throw redirect("/dashboard");

  return { session };
}
