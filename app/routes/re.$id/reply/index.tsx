"use client";

import { useReplyForm } from "./hooks";
import { FormProvider } from "react-hook-form";
import { ReplyInput } from "./components/reply-input";
import { FormType } from "@repo/form";
import { ReplyBox } from "@/components/interface/reply-box";
import { RevealSlide } from "@/components/interface/reveal-slide";

interface ReplyFormProps {
  form: FormType;
}

export function ReplyForm({ form }: ReplyFormProps) {
  const {
    screenIndex,
    screens,
    canComplete,
    canGoBack,
    canProceed,
    handleBack,
    handleNext,
    handleComplete,
    completed,
    methods,
  } = useReplyForm({ form });

  const {
    formState: { isSubmitting },
  } = methods;

  async function handleSubmit(data: any) {
    console.log(data);
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
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
