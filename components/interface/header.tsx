import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function HeaderRoot({ children, className }: HeaderProps) {
  return (
    <header className={cn("my-8 mx-1 space-y-4", className)}>{children}</header>
  );
}

interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}

function Title({ children, className }: TitleProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl border-none focus:border-none resize-none",
        className
      )}
    >
      {children}
    </h1>
  );
}

interface DescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

function Description({ children, className }: DescriptionProps) {
  return (
    <h1
      className={cn(
        "text-xl font-normal tracking-tight first:mt-0 border-none focus:border-none resize-none overflow-hidden h-auto",
        className
      )}
    >
      {children}
    </h1>
  );
}

export const Header = {
  Root: HeaderRoot,
  Title: Title,
  Description: Description,
};
