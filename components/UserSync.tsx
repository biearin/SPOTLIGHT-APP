import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";

export default function UserSync() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);

  useEffect(() => {
    // Only proceed if we have authentication, user is loaded, and user data exists
    if (isSignedIn && userLoaded && user && user.id && !hasAttemptedSync) {
      setHasAttemptedSync(true);

      // Create or get user in Convex when signed in
      createOrGetUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        image: user.imageUrl || "",
        username: user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
      }).catch((error) => {
        console.error("Error creating user:", error);
        setHasAttemptedSync(false); // Allow retry on error
      });
    } else if (!isSignedIn) {
      setHasAttemptedSync(false); // Reset for next sign in
    }
  }, [isSignedIn, userLoaded, user, createOrGetUser, hasAttemptedSync]);

  return null; // This component doesn't render anything
}
