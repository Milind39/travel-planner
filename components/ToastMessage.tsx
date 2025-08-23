"use client";

import { toast } from "sonner";
import { useEffect } from "react";

export default function ToastWrapper({ message }: { message: string }) {
  useEffect(() => {
    if (message) toast.error(message);
  }, [message]);

  return null; // nothing renders visually
}
