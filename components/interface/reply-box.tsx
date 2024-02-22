import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Button } from "../ui/button";
import { ChevronLeft, Loader, MoveRight } from "lucide-react";
import { HTMLAttributes } from "react";

interface ReplyBoxProps {
  children?: React.ReactNode;
  className?: string;
}

function ReplyBoxRoot({ children, className }: ReplyBoxProps) {
  return (
    <div className="overflow-hidden">
      <Container
        className={cn(
          "min-h-screen flex flex-col justify-center items-center",
          className
        )}
      >
        <div className="w-full space-y-8">{children}</div>
      </Container>
    </div>
  );
}

interface ReplyBoxHeaderProps {
  children?: React.ReactNode;
}

function ReplyBoxHeader({ children }: ReplyBoxHeaderProps) {
  return <header className="my-8 mx-1 space-y-4">{children}</header>;
}

interface ReplyBoxTitleProps {
  children?: React.ReactNode;
}

function ReplyBoxTitle({ children }: ReplyBoxTitleProps) {
  return (
    <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl border-none focus:border-none resize-none">
      {children}
    </h1>
  );
}

interface ReplyBoxDescriptionProps {
  children?: React.ReactNode;
}

function ReplyBoxDescription({ children }: ReplyBoxDescriptionProps) {
  return (
    <h1 className="text-xl font-normal tracking-tight first:mt-0 border-none focus:border-none resize-none overflow-hidden h-auto">
      {children}
    </h1>
  );
}

interface ReplyBoxInputProps {
  children?: React.ReactNode;
}

function ReplyBoxInput({ children }: ReplyBoxInputProps) {
  return <div className="m-1">{children}</div>;
}

interface ReplyBoxFooterProps {
  children?: React.ReactNode;
}

function ReplyBoxFooter({ children }: ReplyBoxFooterProps) {
  return <div className="mx-1">{children}</div>;
}

interface ReplyBoxHandleNextProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function ReplyBoxHandleNext({ active, ...props }: ReplyBoxHandleNextProps) {
  if (!active) return null;
  return (
    <div className="flex justify-end mx-1">
      <Button className="h-11 font-bold" {...props}>
        <div className="flex justify-between w-32 items-center">
          <span>Continuar</span>
          <span>
            <MoveRight />
          </span>
        </div>
      </Button>
    </div>
  );
}

interface ReplyBoxHandleCompleteProps
  extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  isSubmitting?: boolean;
}

function ReplyBoxHandleComplete({
  active,
  isSubmitting,
  ...props
}: ReplyBoxHandleCompleteProps) {
  if (!active) return null;
  return (
    <Button
      className="w-full h-11 font-bold mt-8"
      type="submit"
      variant={"default"}
      disabled={isSubmitting}
      {...props}
    >
      Finalizar
      {isSubmitting && <Loader className="animate-spin" />}
    </Button>
  );
}

interface ReplyBoxHandleBackProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function ReplyBoxHandleBack({ active, ...props }: ReplyBoxHandleBackProps) {
  if (!active) return null;
  return (
    <Button
      {...props}
      className="bg-accent text-accent-foreground hover:bg-foreground/10 mx-1"
      size="icon"
      type="button"
    >
      <ChevronLeft />
    </Button>
  );
}

export const ReplyBox = {
  Root: ReplyBoxRoot,
  Header: ReplyBoxHeader,
  Title: ReplyBoxTitle,
  Description: ReplyBoxDescription,
  Input: ReplyBoxInput,
  Footer: ReplyBoxFooter,
  HandleNext: ReplyBoxHandleNext,
  HandleBack: ReplyBoxHandleBack,
  HandleComplete: ReplyBoxHandleComplete,
};
