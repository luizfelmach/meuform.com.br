import { useEffect } from "react";
import { toast } from "sonner";

interface useFlashErrorProps {
  error?: string;
  errorId?: number;
}

export function useFlashError({ error, errorId }: useFlashErrorProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error) toast.error(error);
    }, 400);
    return () => clearTimeout(timeout);
  }, [errorId]);
}
