import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { ensureAuthenticated, ensureSubscribed } from "@/action/middlewares";
import { env } from "@/lib/env";

export async function loader({ request }: LoaderFunctionArgs) {
  const { id } = await ensureAuthenticated(request);
  await ensureSubscribed(id);

  return redirect(env.STRIPE_PORTAL_URL);
}
