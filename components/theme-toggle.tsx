"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    console.log("Switching to:", newTheme);
  };

  return (
    <Button
      variant="secondary"
      size={"sm"}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="hover:scale-[1.02] hover:border rounded-full"
    >
      {theme == "light" ? <Sun fill="yellow" /> : <Moon fill="white" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
