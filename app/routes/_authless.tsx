import { getSession } from "@/lib/session";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, json } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("id")) {
    return redirect("/dashboard");
  }
  return json({});
}

export default function Authless() {
  return <Outlet />;
}
