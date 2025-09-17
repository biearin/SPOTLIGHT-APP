import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";

export default function UserSync() {
  const { isSignedIn, user } = useAuth();
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);

  useEffect(() => {
    console.log("UserSync: isSignedIn =", isSignedIn, "user =", user ? "exists" : "null");
    
    // Wait for both isSignedIn and user to be available
    if (isSignedIn && user && user.id && !hasAttemptedSync) {
      console.log("UserSync: User data available, attempting to create/get user:", {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        image: user.imageUrl || "",
        username: user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
      });

      setHasAttemptedSync(true);

      // Create or get user in Convex when signed in
      createOrGetUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        image: user.imageUrl || "",
        username: user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
      })
      .then((result) => {
        console.log("UserSync: Successfully created/got user:", result);
      })
      .catch((error) => {
        console.error("UserSync: Error creating/getting user:", error);
        setHasAttemptedSync(false); // Allow retry on error
      });
    } else if (isSignedIn && !user) {
      console.log("UserSync: User is signed in but user object is not loaded yet, waiting...");
    }
  }, [isSignedIn, user, createOrGetUser, hasAttemptedSync]);

  return null; // This component doesn't render anything
}
