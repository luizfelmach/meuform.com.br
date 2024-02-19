import { Session, json, redirect } from "@remix-run/node";
import { flashError } from "./session";
import { SessionData, SessionFlashData, commitSession } from "@/lib/session";

type SessionType = Session<SessionData, SessionFlashData>;

export async function NotAuthenticatedRequest(session: SessionType) {
  flashError(session, "Você precisa se autenticar primeiro.");
  throw redirect("/signin", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function AuthenticatedRequest() {
  throw redirect("/dashboard");
}

export async function IncorrectCredentialsRequest(session: SessionType) {
  flashError(session, "Credenciais informadas estão incorretas.");
  return redirect("/signin", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function EmailAlreadyInUseRequest(session: SessionType) {
  flashError(session, "Alguém já está usando esse e-mail.");
  return redirect("/signup", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function EmailDoesNotExistsRequest(session: SessionType) {
  flashError(session, "Não foi possível encontrar seu e-mail.");
  return redirect("/forgot", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function InvalidOrExpiredRequest(session: SessionType) {
  flashError(session, "Solicitação inválida ou expirada.");
  return redirect("/signin", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function BadRequest(message?: string) {
  throw json(null, {
    status: 400,
    statusText: message ?? "Unknown error.",
  });
}
