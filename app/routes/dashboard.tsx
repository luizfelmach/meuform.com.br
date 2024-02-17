import { commitSession, getSession } from "@/lib/session";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) {
    session.flash("error", "Você precisa se autenticar primeiro.");
    session.flash("errorId", Math.random());
    return redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  return json({});
}

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1>Dashboard...</h1>
    </div>
  );
}
