import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-2xl m-auto h-full p-4 w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
