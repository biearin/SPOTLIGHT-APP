import { useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function InitialLayout() {
const  { isLoaded, isSignedIn, user } = useAuth ()

const segments = useSegments ();
const router = useRouter();

useEffect(() => {
    console.log("InitialLayout: isLoaded =", isLoaded, "isSignedIn =", isSignedIn, "user =", user ? "exists" : "null");
    console.log("InitialLayout: segments =", segments);
    
    if(!isLoaded) {
        console.log("InitialLayout: ⏳ Clerk not loaded yet, waiting...");
        return;
    }

const inAuthScreen = segments [0] === "(auth)";

console.log("InitialLayout: inAuthScreen =", inAuthScreen);

if (!isSignedIn && !inAuthScreen) {
    console.log("InitialLayout: ❌ Not signed in, redirecting to login");
    router.replace("/(auth)/login");
} else if (isSignedIn && inAuthScreen) {
    console.log("InitialLayout: ✅ Signed in but on auth screen, redirecting to tabs");
    router.replace("/(tabs)");
} else if (isSignedIn && !inAuthScreen) {
    console.log("InitialLayout: ✅ Signed in and on correct screen");
} else {
    console.log("InitialLayout: 🤔 Unexpected state - no action taken");
}
}, [isLoaded, isSignedIn, segments, router]);

if (!isLoaded) return null;

return <Stack screenOptions={{ headerShown: false }} />;
}