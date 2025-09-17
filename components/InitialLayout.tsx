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
    
    if(!isLoaded) return;

const inAuthScreen = segments [0] === "(auth)";

console.log("InitialLayout: inAuthScreen =", inAuthScreen);

if (!isSignedIn && !inAuthScreen) {
    console.log("InitialLayout: Redirecting to login");
    router.replace("/(auth)/login");
} else if (isSignedIn && inAuthScreen) {
    console.log("InitialLayout: Redirecting to tabs");
    router.replace("/(tabs)");
} else {
    console.log("InitialLayout: No redirect needed");
}
}, [isLoaded, isSignedIn, segments, router]);

if (!isLoaded) return null;

return <Stack screenOptions={{ headerShown: false }} />;
}