import * as yup from "yup";
import { ensureAuthenticated, ensureBody } from "@/action/middlewares";
import { FormType } from "@/form/types";
import { prisma } from "@/lib/prisma";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { EditorProvider } from "./editor/provider";
import { NavbarEditor } from "./editor/components/navbar-editor";
import { EditorSection } from "./editor/components/editor-section";

export default function Page() {
  const submit = useSubmit();
  const { form } = useLoaderData<typeof loader>();
  async function handleSubmit(data: FormType) {
    console.log(data);

    submit(
      {
        name: data.name,
        screens: JSON.stringify(data.screens),
        endScreen: JSON.stringify(data.endScreen),
      },
      { method: "POST" }
    );
  }

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

const updateFormSchema = yup.object();

type updateFormType = yup.InferType<typeof updateFormSchema>;

export async function action({ request, params }: ActionFunctionArgs) {
  const body = (await ensureBody<updateFormType>(
    updateFormSchema,
    request
  )) as any;
  const { id } = await ensureAuthenticated(request);

  await prisma.form.update({
    where: {
      id: params.id,
      customerId: id,
    },
    data: {
      name: body.name,
      screens: JSON.parse(body.screens),
      endScreen: JSON.parse(body.endScreen),
    },
  });

  return json({});
}
