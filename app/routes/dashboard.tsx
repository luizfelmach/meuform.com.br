import { jsonSession } from "@/action";
import { ensureAuthenticated, ensureSubscribed } from "@/action/middlewares";
import { getFlash } from "@/action/session";
import { useFlash } from "@/components/hook/flash";
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
    <div className="h-screen w-screen flex items-center justify-center">
      <h1>Dashboard...</h1>
    </div>
  );
}
