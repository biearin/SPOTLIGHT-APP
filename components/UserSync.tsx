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
    
    // Only proceed if we have both authentication and user data
    if (isSignedIn && user && user.id && !hasAttemptedSync) {
      console.log("UserSync: ✅ Both auth and user data available! Creating user...");
      console.log("UserSync: User data:", {
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
        console.log("UserSync: ✅ SUCCESS! User created/retrieved:", result);
      })
      .catch((error) => {
        console.error("UserSync: ❌ ERROR creating user:", error);
        setHasAttemptedSync(false); // Allow retry on error
      });
    } else if (isSignedIn && !user) {
      console.log("UserSync: ⏳ Signed in but waiting for user object to load...");
    } else if (!isSignedIn) {
      console.log("UserSync: ❌ Not signed in");
      setHasAttemptedSync(false); // Reset for next sign in
    }
  }, [isSignedIn, user, createOrGetUser, hasAttemptedSync]);

  return null; // This component doesn't render anything
}
