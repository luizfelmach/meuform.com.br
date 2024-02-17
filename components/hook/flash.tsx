import { SessionFlashData } from "@/lib/session";
import { useEffect } from "react";
import { toast } from "sonner";

export function useFlash({ success, error }: SessionFlashData) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (success) toast.success(success.message);
    }, 400);
    return () => clearTimeout(timeout);
  }, [success?.id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error) toast.error(error.message);
    }, 400);
    return () => clearTimeout(timeout);
  }, [error?.id]);
}
