import { ReplyBox } from "@/components/interface/reply-box";
import { FormType } from "@/form/types";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useReplyForm } from "./reply/hooks";
import { FormProvider } from "react-hook-form";
import { RevealSlide } from "@/components/interface/reveal-slide";
import { ReplyInput } from "./reply/components/reply-input";

export default function Page() {
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
  } = useReplyForm({ form });

  const {
    formState: { isSubmitting },
  } = methods;

  async function handleSubmit(data: any) {
    console.log(data);
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

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await prisma.form
    .findFirst({ where: { id: params.id } })
    .catch(() => null);

  if (!response) return redirect("/");

  return json({ response });
}
