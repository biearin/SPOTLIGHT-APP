import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

export default function UserSync() {
  const { isSignedIn, user } = useAuth();
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  useEffect(() => {
    console.log("UserSync: isSignedIn =", isSignedIn, "user =", user ? "exists" : "null");
    
    if (isSignedIn && user) {
      console.log("UserSync: Attempting to create/get user with data:", {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        image: user.imageUrl || "",
        username: user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
      });

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
      });
    }
  }, [isSignedIn, user, createOrGetUser]);

  return null; // This component doesn't render anything
}
