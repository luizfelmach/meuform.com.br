import { Outlet } from "@remix-run/react";
import { ensureAuthenticated } from "@/action/middlewares";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { NavbarMenusDashboard } from "./navbar-menus";
import { NavbarDashboard } from "./navbar";

export async function loader({ request }: LoaderFunctionArgs) {
  const {} = await ensureAuthenticated(request);
  return json({});
}

export default function Layout() {
  return (
    <main>
      <NavbarDashboard />
      <NavbarMenusDashboard />
      <Outlet />
    </main>
  );
}
