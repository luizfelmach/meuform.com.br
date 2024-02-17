import { commitSession, getSession } from "@/lib/session";
import { redirect } from "@remix-run/node";

export async function authenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) {
    session.flash("error", {
      message: "Você precisa se autenticar primeiro.",
      id: Math.random(),
    });

    throw redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
}

export async function unauthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("id")) throw redirect("/dashboard");
}
