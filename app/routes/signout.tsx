import { commitSession, destroySession, getSession } from "@/lib/session";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) {
    session.flash("error", {
      message: "Você precisa se autenticar primeiro.",
      id: Math.random(),
    });
    return redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  destroySession(session);
  session.unset("id");

  return redirect("/signin", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
