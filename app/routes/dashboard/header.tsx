import { cn } from "@/lib/utils";

interface RootProps {
  children?: React.ReactNode;
  className?: string;
}

function Root({ children, className }: RootProps) {
  return (
    <header
      className={cn(
        "sm:flex justify-between items-center my-10 space-y-4",
        className
      )}
    >
      {children}
    </header>
  );
}

interface ContentProps {
  children?: React.ReactNode;
  className?: string;
}

function Content({ children, className }: ContentProps) {
  return <div>{children}</div>;
}

interface ActionProps {
  children?: React.ReactNode;
  className?: string;
}

function Action({ children, className }: ActionProps) {
  return <div>{children}</div>;
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

export const HeaderDashboard = {
  Root,
  Title,
  Description,
  Content,
  Action,
};
