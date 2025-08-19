"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        if (data?.name || data?.email) {
          toast.success(`Welcome ${data.name ?? data.email}!`);
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {/* rest of your page */}
    </>
  );
}
