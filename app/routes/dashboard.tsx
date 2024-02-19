import { jsonSession } from "@/action";
import { ensureAuthenticated, ensureSubscribed } from "@/action/middlewares";
import { getFlash } from "@/action/session";
import { useFlash } from "@/components/hook/flash";
import { DashboardLayout } from "@/components/interface/dashboard-layout";
import { NavbarDashboard } from "@/components/interface/navbar-dashboard";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, id } = await ensureAuthenticated(request);
  const url = new URL(request.url);

  const flash = getFlash(session);
  if (url.searchParams.get("payment")) return await jsonSession(flash, session);
  await ensureSubscribed(id as string);

  return await jsonSession(flash, session);
}

export default function Page() {
  const flash = useLoaderData<typeof loader>();
  useFlash(flash);
  return (
    <div>
      <NavbarDashboard />
      <DashboardLayout.Root>
        <DashboardLayout.Header>
          <DashboardLayout.Title>Formulários</DashboardLayout.Title>
          <DashboardLayout.Description>
            Gerencie e visualize seus formulários.
          </DashboardLayout.Description>
        </DashboardLayout.Header>
        <DashboardLayout.Content>CONTENT</DashboardLayout.Content>
      </DashboardLayout.Root>
    </div>
  );
}
