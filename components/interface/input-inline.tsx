import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface InputInlineProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  preventEnter?: boolean;
}

export const InputInline = forwardRef<HTMLDivElement, InputInlineProps>(
  ({ value, className, preventEnter, ...props }, ref) => {
    return (
      <div
        ref={ref}
        suppressContentEditableWarning
        contentEditable
        className={cn("outline-none break-words", className)}
        onKeyDown={(e) => {
          preventEnter && e.key === "Enter" && e.preventDefault();
        }}
        {...props}
      >
        {value}
      </div>
    );
  }
);
