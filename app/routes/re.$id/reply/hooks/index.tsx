import { getSchemasReply, visibleScreenReply } from "@/form/replying";
import { FormType, ScreenType } from "@/form/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface UseReplyFormProps {
  form: FormType;
}

export function useReplyForm({ form }: UseReplyFormProps) {
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const [screens, setScreens] = useState<ScreenType[]>(form.screens);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canComplete, setCanComplete] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const screen = screens[screenIndex];

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(getSchemasReply(screens)),
  });

  const { trigger, watch, getValues } = methods;
  const currentScreenWatch = watch(screens[screenIndex].screenKey);

  async function handleNext() {
    const isValid = await trigger(screen.screenKey);
    if (!isValid) return;
    setCanProceed((prev) => {
      if (prev) setScreenIndex(screenIndex + 1);
      return prev;
    });
  }

  function handleBack() {
    if (canGoBack) setScreenIndex(screenIndex - 1);
  }

  function handleComplete() {
    setCompleted(true);
    setCanProceed(false);
    setCanGoBack(false);
    setCanComplete(false);
  }

  useEffect(() => {
    if (completed) return;
    const visibles = form.screens.filter((e) =>
      visibleScreenReply(e, getValues())
    );
    setScreens(visibles);
    const hasNext = screenIndex <= visibles.length - 2;
    setCanProceed(hasNext);
    setCanGoBack(screenIndex > 0);
    setCanComplete(!hasNext);
  }, [screenIndex, currentScreenWatch]);

  return {
    canProceed,
    canGoBack,
    canComplete,
    completed,

    handleBack,
    handleNext,
    handleComplete,

    methods,

    screenIndex,
    screens,
  };
}
