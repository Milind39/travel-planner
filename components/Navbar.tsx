"use client";

import React, { useState } from "react";
import { ModeToggle } from "./theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X, Plane, DollarSign } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-50 shadow-sm supports-[backdrop-filter]:bg-black/20">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative">
              <Image
                alt="Travel Planner Logo"
                src="/logo.png"
                height={40}
                width={40}
                priority
                className="rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-20 rounded-full group-hover:opacity-30 transition-opacity" />
            </div>
            <div className="hidden sm:flex items-baseline gap-1">
              <span className="text-2xl font-bold bg-indigo-600 bg-clip-text text-transparent hover:scale-[1.08] transition-transform duration-150">
                {" "}
                Travel{" "}
              </span>{" "}
              <span className="text-2xl font-bold text-background hover:scale-[1.08] transition-transform duration-150">
                {" "}
                Planner{" "}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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

            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-white hover:bg-indigo-600 hover:scale-[1.02] transition-transform duration-100 rounded-full p-4"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-white hover:bg-indigo-600 hover:scale-[1.02] transition-transform duration-100 rounded-full p-4"
                >
                  Sign Up
                </Button>
              </Link>
            </SignedOut>

            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="hover:bg-primary/10"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-black/60 backdrop-blur-md border-b border-border/50 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-6 space-y-4">
              <SignedIn>
                <Link
                  href="/trips"
                  className="flex items-center gap-3 text-muted-foreground hover:text-indigo-700 hover:scale-[1.02] transition-transform duration-100 hover:border p-3 rounded-lg hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                >
                  <Plane className="h-5 w-5" />
                  My Trips
                </Link>
                <hr />
                <Link
                  href="/Pricing"
                  className="flex items-center gap-3 text-muted-foreground hover:text-indigo-700 hover:scale-[1.02] transition-transform duration-100 hover:border p-3 rounded-lg hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                >
                  <DollarSign />
                  Pricing
                </Link>
              </SignedIn>

              <SignedOut>
                <div className="flex flex-col gap-3 border-border/50">
                  <Link
                    href="/sign-in"
                    className="text-foreground hover:text-white hover:bg-indigo-600 hover:scale-[1.02] transition-transform duration-100 rounded-full pl-8 p-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Log-In
                  </Link>
                  <hr />
                  <Link
                    href="/sign-up"
                    className="text-foreground hover:text-white hover:bg-indigo-600 hover:scale-[1.02] transition-transform duration-100 rounded-full p-4 pl-8"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign-Up
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
