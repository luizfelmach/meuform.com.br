import { authenticated } from "@/action/auth";
import { headerSession, reqSession } from "@/action/session";
import { destroySession } from "@/lib/session";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await reqSession(request);

  await authenticated(request);
  destroySession(session);
  session.unset("id");

  return redirect("/signin", { ...(await headerSession(session)) });
}
