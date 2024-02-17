import { commitSession, getSession } from "@/lib/session";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, json } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("id")) {
    session.flash("error", "Você precisa se autenticar primeiro.");
    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return json({});
}

export default function Authless() {
  return <Outlet />;
}
