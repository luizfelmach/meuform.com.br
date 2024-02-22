import { ensureAuthenticated } from "@/action/middlewares";
import { FormType } from "@/form/types";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EditorProvider } from "./editor/provider";
import { NavbarEditor } from "./editor/components/navbar-editor";
import { EditorSection } from "./editor/components/editor-section";

export default function Page() {
  const { form } = useLoaderData<typeof loader>();
  async function handleSubmit(data: FormType) {}

  return (
    <EditorProvider handleSubmit={handleSubmit} form={form as any}>
      <NavbarEditor />
      <EditorSection />
    </EditorProvider>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = await ensureAuthenticated(request);

  const form = await prisma.form
    .findFirst({
      where: {
        id: params.id,
        customerId: id,
      },
    })
    .catch(() => null);

  if (!form) return redirect("/dashboard");

  return json({ form });
}
