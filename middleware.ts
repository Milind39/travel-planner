// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
      Protect all routes except static files (_next), 
      and optionally sign-in/up pages if you want them public
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
