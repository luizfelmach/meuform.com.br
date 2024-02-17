import { authenticated } from "@/action/auth";
import { reqSession } from "@/action/session";
import { subscribed } from "@/action/stripe";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await reqSession(request);
  await authenticated(request);

  const id = session.get("id");

  const customer = await prisma.customer.findFirst({ where: { id } });

  await subscribed(customer?.paymentId as string);

  return json({});
}

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1>Dashboard...</h1>
    </div>
  );
}
