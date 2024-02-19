import { SessionType, commitSession, getSession } from "@/lib/session";

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

export function flashRedirect(session: SessionType, url: string) {
  session.flash("redirect", url);
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
