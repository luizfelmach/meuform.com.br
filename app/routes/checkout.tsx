import { env } from "@/lib/env";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadStripe } from "@stripe/stripe-js";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ensureAuthenticated, ensureNotSubscribed } from "@/action/middlewares";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

export default function Page() {
  const { clientSecret, stripePublicKey } = useLoaderData<typeof loader>();
  const stripePromise = loadStripe(stripePublicKey);
  return (
    <div className="mt-4">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { id } = await ensureAuthenticated(request);
  await ensureNotSubscribed(id);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  let product = env.STRIPE_PRICE_MONTHLY;
  if (plan === "yearly") product = env.STRIPE_PRICE_YEARLY;

  const customer = await prisma.customer.findFirst({ where: { id } });
  const returnUrl = new URL("/dashboard", request.url);
  returnUrl.searchParams.set("payment", "success");

  const checkoutSession = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [{ price: product, quantity: 1 }],
    customer: customer?.paymentId,
    mode: "subscription",
    return_url: returnUrl.href,
    allow_promotion_codes: true,
  });

  return json({
    clientSecret: checkoutSession.client_secret,
    stripePublicKey: env.STRIPE_PUBLIC_KEY,
  });
}
