import { redirectSession } from "@/action";
import { ensureAuthenticated } from "@/action/middlewares";
import { destroySession } from "@/lib/session";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureAuthenticated(request);
  destroySession(session);
  session.unset("id");
  return await redirectSession("/signin", session);
}
