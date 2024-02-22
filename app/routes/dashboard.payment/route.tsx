import { env } from "@/lib/env";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadStripe } from "@stripe/stripe-js";
import { stripe } from "@/lib/stripe";
import { ensureAuthenticated } from "@/action/middlewares";
import { Container } from "../dashboard/container";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

export default function Page() {
  const { clientSecret, stripePublicKey } = useLoaderData<typeof loader>();
  const stripePromise = loadStripe(stripePublicKey);
  return (
    <Container.Root>
      <Container.Header>
        <Container.Title>Assinatura</Container.Title>
        <Container.Description>
          Gerencie sua assinatura no site.
        </Container.Description>
      </Container.Header>
      <Container.Content>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </Container.Content>
    </Container.Root>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { paymentId } = await ensureAuthenticated(request);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  let product = env.STRIPE_PRICE_MONTHLY;
  if (plan === "yearly") product = env.STRIPE_PRICE_YEARLY;

  const returnUrl = new URL(
    "/payment?checkout_session={CHECKOUT_SESSION_ID}",
    request.url
  );

  const checkoutSession = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [{ price: product, quantity: 1 }],
    customer: paymentId,
    mode: "subscription",
    return_url: returnUrl.href,
    allow_promotion_codes: true,
  });

  return json({
    clientSecret: checkoutSession.client_secret,
    stripePublicKey: env.STRIPE_PUBLIC_KEY,
  });
}
