import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ScreenCardProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

function ScreenCardRoot({
  active,
  className,
  children,
  ...props
}: ScreenCardProps) {
  if (active) className += " border-l-8 border-l-primary ";

  return (
    <div
      className={cn(
        "cursor-pointer bg-accent border border-foreground/5 rounded-sm min-h-12 p-4 flex justify-between items-center transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ScreenCardTitleProps {
  children?: React.ReactNode;
}

function ScreenCardTitle({ children }: ScreenCardTitleProps) {
  return (
    <p className="text-foreground font-medium text-sm line-clamp-3 break-words">
      {children}
    </p>
  );
}

interface ScreenCardActionsProps {
  children?: React.ReactNode;
}

function ScreenCardActions({ children }: ScreenCardActionsProps) {
  return <div>{children}</div>;
}

export const ScreenCard = {
  Root: ScreenCardRoot,
  Title: ScreenCardTitle,
  Actions: ScreenCardActions,
};
