import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RootProps {
  children?: React.ReactNode;
}

function Root({ children }: RootProps) {
  return <div>{children}</div>;
}

interface HeaderProps {
  children?: React.ReactNode;
  action?: React.ReactNode;
}

function Header({ action, children }: HeaderProps) {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 my-10 space-y-4 sm:flex justify-between items-center">
        <div>{children}</div>
        <div>{action}</div>
      </div>
      <Separator />
    </div>
  );
}

interface TitleProps {
  children?: string;
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
  children?: string;
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

interface ContentProps {
  className?: string;
  children?: React.ReactNode;
}

function Content({ children, className }: ContentProps) {
  return (
    <div className={cn("max-w-5xl mx-auto px-4 my-10 space-y-4", className)}>
      {children}
    </div>
  );
}

export const Container = {
  Root,
  Header,
  Title,
  Description,
  Content,
};
