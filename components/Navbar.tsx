import React from "react";
import { ModeToggle } from "./theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-10 supports-[backdrop-filter]: bg-black/20">
      <nav className="container mx-auto h-16 flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center px-2 lg:px-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              alt="Travel Planner Logo"
              src="/logo.png"
              height={40}
              width={40}
              priority
              className="rounded-full hover:scale-[1.08]"
            />
            <span className="text-2xl font-bold bg-indigo-600 bg-clip-text text-transparent hover:scale-[1.08] transition-transform duration-150">
              Travel
            </span>
            <span className="text-2xl font-bold text-background hover:scale-[1.08] transition-transform duration-150">
              Planner
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* When user is signed in */}
            <SignedIn>
              <Link
                href="/trips"
                className="text-foreground hover:text-indigo-700 hover:scale-[1.02] transition-transform duration-100 hover:border rounded-full p-2"
              >
                My Trips
              </Link>
              <Link
                href="/Pricing"
                className="text-foreground hover:text-indigo-700 hover:scale-[1.02] transition-transform duration-100 hover:border rounded-full p-2"
              >
                Pricing
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* When user is signed out */}
            <SignedOut>
              <Link href="/sign-in">
                <Button className="bg-indigo-800 hover:bg-indigo-900 text-white p-2 rounded-sm">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-indigo-800 hover:bg-indigo-900 text-white p-2 rounded-sm">
                  Sign Up
                </Button>
              </Link>
            </SignedOut>

            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
