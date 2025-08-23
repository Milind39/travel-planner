import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import UserSync from "@/components/UserSync/userSync";

export const metadata: Metadata = {
  title: "Travel-Planner",
  description: "Plan Your Travels using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <UserSync />
              <Navbar />
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </ClerkProvider>
        </body>
      </html>
    </>
  );
}
