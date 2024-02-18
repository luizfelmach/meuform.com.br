import { authenticated } from "@/action/auth";
import { ensureSubscribed } from "@/action/middlewares";
import { reqSession } from "@/action/session";
import { getSubscriptionStatus, subscribed } from "@/action/stripe";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await reqSession(request);
  await authenticated(request);

  const id = session.get("id");
  const url = new URL(request.url);
  if (url.searchParams.get("payment")) return json({});

  await ensureSubscribed(id as string);

  return json({});
}

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1>Dashboard...</h1>
    </div>
  );
}
