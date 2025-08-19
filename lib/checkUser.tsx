import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Find existing user by clerkUserId
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    // Create new user without transactions
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        image: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error: any) {
    console.error("Error in checkUser:", error.message);
    return null;
  }
};
