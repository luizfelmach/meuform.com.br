import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  return json({ ok: true, message: "System good" });
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig)
    return new Response(JSON.stringify({ message: "Missing signature" }), {
      status: 400,
    });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.ENDPOINT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ message: "An invalid signature" }), {
      status: 401,
    });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
        const subscription = event.data.object;
        await updateSubscriptionDb(
          subscription.customer as string,
          subscription.id
        );
        break;
      case "customer.subscription.deleted":
        const subscriptionDelete = event.data.object;
        await updateSubscriptionDb(subscriptionDelete.customer as string);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (e) {
    if (e instanceof Error)
      return new Response(JSON.stringify({ message: e.message }), {
        status: 500,
      });
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }

  return json({ received: true });
}

async function updateSubscriptionDb(
  paymentId: string,
  subscriptionId?: string
) {
  await prisma.customer.update({
    where: {
      paymentId,
    },
    data: {
      subscriptionId: subscriptionId || "",
    },
  });
}
