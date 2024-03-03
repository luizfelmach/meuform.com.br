import * as yup from "yup";
import { ReplyBox } from "@/components/interface/reply-box";
import { FormType } from "@/form/types";
import { prisma } from "@/lib/prisma";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useReplyForm } from "./reply/hooks";
import { FormProvider } from "react-hook-form";
import { RevealSlide } from "@/components/interface/reveal-slide";
import { ReplyInput } from "./reply/components/reply-input";
import { ensureBody } from "@/action/middlewares";

export default function Page() {
  const submit = useSubmit();
  const { response } = useLoaderData<typeof loader>();
  const form: FormType = response as any;

  const {
    screenIndex,
    screens,
    canComplete,
    canGoBack,
    canProceed,
    handleBack,
    handleNext,
    completed,
    methods,
    handleComplete,
  } = useReplyForm({ form });

  const {
    formState: { isSubmitting },
  } = methods;

  async function handleSubmit(data: any) {
    submit(data, { method: "POST" });
    handleComplete();
  }

  return (
    <ReplyBox.Root>
      <ReplyBox.HandleBack active={canGoBack} onClick={() => handleBack()} />

      {!completed && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {screens.map((screen, index) => (
              <RevealSlide
                key={index}
                visible={index === screenIndex}
                direction={index > screenIndex}
              >
                <ReplyBox.Header>
                  <ReplyBox.Title>{screen.title}</ReplyBox.Title>
                  <ReplyBox.Description>
                    {screen.description}
                  </ReplyBox.Description>
                </ReplyBox.Header>
                <ReplyBox.Input>
                  <ReplyInput screen={screen} handleNext={handleNext} />
                </ReplyBox.Input>
              </RevealSlide>
            ))}
            <ReplyBox.HandleComplete
              active={canComplete}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
      )}

      <RevealSlide visible={completed} direction={true}>
        <ReplyBox.Header>
          <ReplyBox.Title>{form.endScreen.title}</ReplyBox.Title>
          <ReplyBox.Description>
            {form.endScreen.description}
          </ReplyBox.Description>
        </ReplyBox.Header>
      </RevealSlide>

      <ReplyBox.HandleNext
        active={canProceed}
        onClick={async () => handleNext()}
      />
    </ReplyBox.Root>
  );
}

const replySchema = yup.object();

type replyType = yup.InferType<typeof replySchema>;

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await prisma.form
    .findFirst({ where: { id: params.id } })
    .catch(() => null);

  if (!response) return redirect("/");

  return json({ response });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const body = await ensureBody<replyType>(replySchema, request);
  const response = await prisma.form
    .findFirst({ where: { id: params.id } })
    .catch(() => null);

  if (!response) return redirect("/");

  await prisma.formAnswer.create({
    data: {
      data: body,
      formId: response.id,
    },
  });

  return json({});
}
