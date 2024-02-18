import { SessionFlashData } from "@/lib/session";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export function useFlash({ success, error, payment }: SessionFlashData) {
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (payment) {
        toast.success(payment.message);
        confetti({
          particleCount: 100,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [payment?.id]);
}
