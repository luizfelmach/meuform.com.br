import { commitSession, getSession } from "@/lib/session";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("id");

  return redirect("/signin", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
