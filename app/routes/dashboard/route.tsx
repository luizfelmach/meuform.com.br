import { Outlet, useLoaderData } from "@remix-run/react";
import { ensureAuthenticated } from "@/action/middlewares";
import { LoaderFunctionArgs } from "@remix-run/node";
import { NavbarMenusDashboard } from "./navbar-menus";
import { NavbarDashboard } from "./navbar";
import { getFlash } from "@/action/session";
import { useFlash } from "@/components/hook/flash";
import { jsonSession } from "@/action";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureAuthenticated(request);
  const flash = getFlash(session);
  return await jsonSession(flash, session);
}

export default function Layout() {
  const flash = useLoaderData<typeof loader>();
  useFlash(flash);
  return (
    <main>
      <NavbarDashboard />
      <NavbarMenusDashboard />
      <Outlet />
    </main>
  );
}
