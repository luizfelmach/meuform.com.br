import { prisma } from "@/lib/prisma";
import { commitSession, getSession } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import Stripe from "stripe";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) {
    session.flash("error", {
      message: "Você precisa se autenticar primeiro.",
      id: Math.random(),
    });
    return redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  const id = session.get("id");

  const customer = await prisma.customer.findFirst({
    where: { id },
  });

  const customerStripe = await stripe.customers.retrieve(
    customer?.paymentId as string,
    {
      expand: ["subscriptions"],
    }
  );

  const subscriptions = customerStripe as any;

  const subscription = subscriptions["subscriptions"]["data"][0];

  if (!subscription) {
    return redirect("/checkout");
  }

  return json({});
}

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1>Dashboard...</h1>
    </div>
  );
}
