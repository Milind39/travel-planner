"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function UserSync() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/check-user")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            console.log("DB User synced:", data.user);
          } else {
            toast.error("Failed to sync user to DB");
          }
        })
        .catch(() => toast.error("Error connecting to backend"));
    }
  }, [isSignedIn]);

  return null;
}
