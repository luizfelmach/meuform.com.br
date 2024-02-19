import { redirectSession } from "@/action";
import { ensureAuthenticated } from "@/action/middlewares";
import { flashPayment } from "@/action/session";
import { stripe } from "@/lib/stripe";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureAuthenticated(request);
  const url = new URL(request.url);

  const checkoutSessionId = url.searchParams.get("checkout_session");
  if (!checkoutSessionId) return redirect("/dashboard");

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    checkoutSessionId
  );

  if (checkoutSession.payment_status !== "paid") return redirect("/dashboard");
  flashPayment(session, "Pagamento efetuado com sucesso.");

  return await redirectSession("/dashboard?payment=success", session);
}
