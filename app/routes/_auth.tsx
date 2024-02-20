import { Outlet, useLoaderData } from "@remix-run/react";
import { AuthLayout } from "@/components/interface/auth-layout";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ensureNotAuthenticated } from "@/action/middlewares";
import { getFlash } from "@/action/session";
import { jsonSession } from "@/action";
import { useFlash } from "@/components/hook/flash";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureNotAuthenticated(request);
  const flash = getFlash(session);
  return jsonSession(flash, session);
}

export default function Layout() {
  const flash = useLoaderData<typeof loader>();
  useFlash(flash);

  return (
    <AuthLayout.Root>
      <AuthLayout.Main>
        <Outlet />
      </AuthLayout.Main>
      <AuthLayout.Aside>
        <AuthLayout.Banner />
      </AuthLayout.Aside>
    </AuthLayout.Root>
  );
}
