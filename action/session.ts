import { SessionData, SessionType } from "@/lib/session";

export function singInSession(session: SessionType, data: SessionData) {
  const { id, email, name, paymentId } = data;
  session.set("id", id);
  session.set("email", email);
  session.set("name", name);
  session.set("paymentId", paymentId);
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
