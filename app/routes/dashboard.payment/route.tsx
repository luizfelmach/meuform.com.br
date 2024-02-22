import { env } from "@/lib/env";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { loadStripe } from "@stripe/stripe-js";
import { stripe } from "@/lib/stripe";
import { ensureAuthenticated } from "@/action/middlewares";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { ContainerDashboard } from "../dashboard/container";
import { HeaderDashboard } from "../dashboard/header";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const submit = useSubmit();
  const { clientSecret, stripePublicKey } = useLoaderData<typeof loader>();
  const stripePromise = loadStripe(stripePublicKey);
  return (
    <div>
      <HeaderDashboard.Root className="max-w-5xl mx-auto px-4">
        <HeaderDashboard.Content>
          <HeaderDashboard.Title>Assinatura</HeaderDashboard.Title>
          <HeaderDashboard.Description>
            Gerencie sua assinatura no site.
          </HeaderDashboard.Description>
        </HeaderDashboard.Content>
      </HeaderDashboard.Root>

      <Separator className="mb-10" />

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
