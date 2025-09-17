import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

export default function UserSync() {
  const { isSignedIn, user } = useAuth();
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  useEffect(() => {
    if (isSignedIn && user) {
      // Create or get user in Convex when signed in
      createOrGetUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        image: user.imageUrl || "",
        username: user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
      }).catch((error) => {
        console.error("Error creating/getting user:", error);
      });
    }
  }, [isSignedIn, user, createOrGetUser]);

  return null; // This component doesn't render anything
}
