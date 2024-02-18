import { SessionFlashData, commitSession, getSession } from "@/lib/session";
import { Session, SessionData, json, redirect } from "@remix-run/node";

type SessionType = Session<SessionData, SessionFlashData>;

export async function reqSession(request: Request) {
  return await getSession(request.headers.get("Cookie"));
}

export function flashError(session: SessionType, message: string) {
  session.flash("error", {
    message,
    id: Math.random(),
  });
}

export function flashSuccess(session: SessionType, message: string) {
  session.flash("success", {
    message,
    id: Math.random(),
  });
}

export function flashPayment(session: SessionType, message: string) {
  session.flash("payment", {
    message,
    id: Math.random(),
  });
}

export function getFlash(session: SessionType) {
  const data = {
    error: session.get("error"),
    success: session.get("success"),
    payment: session.get("payment"),
  };
  return data;
}

export async function headerSession(session: SessionType) {
  return {
    headers: { "Set-Cookie": await commitSession(session) },
  };
}
