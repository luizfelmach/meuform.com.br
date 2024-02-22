import * as yup from "yup";
import { redirect } from "@remix-run/node";
import {
  getSubscriptionStatus,
  notSubscribedStatus,
  subscribedStatus,
} from "./stripe";
import { getSession } from "@/lib/session";
import {
  AuthenticatedRequest,
  BadRequest,
  NotAuthenticatedRequest,
} from "./errors";
import { flashError } from "./session";

export async function ensureSubscribed(id: string): Promise<subscribedStatus> {
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

  let message: string = "";

  if (subscriptionStatus === null)
    message = "Você ainda não possui nenhuma assinatura.";

  if (subscriptionStatus === "canceled")
    message = "Sua assinatura foi cancelada.";

  if (subscriptionStatus === "incomplete")
    message = "Você ainda não concluiu o pagamento.";

  if (subscriptionStatus === "past_due")
    message = "Você não efetuou o pagamento esse mês. Gerencie sua assinatura.";

  if (subscriptionStatus === "unpaid")
    message = "Você ainda não efetuou o pagamento.";

  if (mustRedirect) {
    throw redirect("/dashboard/payment");
  }

  return subscriptionStatus as subscribedStatus;
}

export async function ensureNotSubscribed(
  id: string
): Promise<notSubscribedStatus> {
  const subscriptionStatus = await getSubscriptionStatus(id);

  if (!subscriptionStatus) return subscriptionStatus;

  const redirectStatus = ["active", "trialing"];

  const mustRedirect = redirectStatus.includes(subscriptionStatus);

  if (mustRedirect) {
    throw redirect("/billing");
  }

  return subscriptionStatus as notSubscribedStatus;
}

export async function ensureAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("id");
  const name = session.get("name")!;
  const email = session.get("email")!;
  const paymentId = session.get("paymentId")!;

  if (!id) {
    throw await NotAuthenticatedRequest(session);
  }

  return { session, id, name, email, paymentId };
}

export async function ensureNotAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("id");

  if (!!id) {
    throw await AuthenticatedRequest();
  }

  return { session };
}

export async function ensureBody<T = any>(
  schema: yup.AnySchema<T>,
  request: Request
): Promise<T> {
  try {
    const bodyData = Object.fromEntries(await request.formData());
    const body = await schema.validate(bodyData);
    return body;
  } catch (e: unknown) {
    if (e instanceof yup.ValidationError) {
      throw await BadRequest(e.message);
    }
    throw await BadRequest();
  }
}
