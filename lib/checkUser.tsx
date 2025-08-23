import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  // Get the current logged-in Clerk user
  const user = await currentUser();

  if (!user) {
    console.error("No Clerk user found.");
    return null;
  }

  try {
    // Check if user already exists in the database
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (existingUser) {
      console.log(existingUser);
      return existingUser;
    }

    // Build safe fallback values
    const email =
      user.emailAddresses?.[0]?.emailAddress ||
      `user-${user.id}@clerk-generated.com`;

    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || "Traveler";

    const image = user.imageUrl || null;

    // Create new user in database
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email,
        name,
        image,
        isSubscribed: false, // default for new users
      },
    });

    console.log("New user inserted in DB:", newUser);
    return newUser;
  } catch (error: any) {
    console.error("Error creating user in DB:", error);
    return null;
  }
};
