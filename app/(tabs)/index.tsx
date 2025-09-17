import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/auth.styles";

export default function Index() {
  const { signOut, user, isSignedIn } = useAuth();
  
  // Query current user from Convex
  const currentUser = useQuery(api.users.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  // Query all users from Convex
  const allUsers = useQuery(api.users.getAllUsers);
  
  // Mutation for manual user creation
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  
  const handleManualUserCreation = async () => {
    console.log("=== MANUAL USER CREATION TEST ===");
    console.log("User object:", user);
    console.log("isSignedIn:", isSignedIn);
    
    if (!user) {
      console.error("❌ No user object available");
      alert("No user object available. Please sign in first.");
      return;
    }
    
    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
      image: user.imageUrl || "",
      username: user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
    };
    
    console.log("📝 Attempting to create user with data:", userData);
    
    try {
      const result = await createOrGetUser(userData);
      console.log("✅ SUCCESS! User created/retrieved:", result);
      alert(`SUCCESS! User created in Convex: ${result?.fullname || 'Unknown'}`);
    } catch (error) {
      console.error("❌ ERROR creating user:", error);
      alert(`ERROR: ${error.message || error}`);
    }
  };

  const handleTestUserCreation = async () => {
    console.log("=== TEST USER CREATION (NO CLERK) ===");
    
    const testUserData = {
      clerkId: "test_user_" + Date.now(),
      email: "test@example.com",
      fullname: "Test User",
      image: "https://via.placeholder.com/150",
      username: "testuser",
    };
    
    console.log("📝 Creating test user with data:", testUserData);
    
    try {
      const result = await createOrGetUser(testUserData);
      console.log("✅ SUCCESS! Test user created:", result);
      alert(`SUCCESS! Test user created in Convex: ${result?.fullname}`);
    } catch (error) {
      console.error("❌ ERROR creating test user:", error);
      alert(`ERROR: ${error.message || error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
          SPOTLIGHT Home
        </Text>
        
        {/* User Info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            Current User:
          </Text>
          {isSignedIn && user ? (
            <View>
              <Text style={{ color: "white" }}>Name: {user.fullName || "N/A"}</Text>
              <Text style={{ color: "white" }}>Email: {user.emailAddresses[0]?.emailAddress || "N/A"}</Text>
              <Text style={{ color: "white" }}>Clerk ID: {user.id}</Text>
            </View>
          ) : (
            <Text style={{ color: "red" }}>Not signed in</Text>
          )}
        </View>

        {/* Convex Data */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            Current User in Convex:
          </Text>
          {currentUser ? (
            <View>
              <Text style={{ color: "green" }}>✅ User found in Convex!</Text>
              <Text style={{ color: "white" }}>Username: {currentUser.username}</Text>
              <Text style={{ color: "white" }}>Fullname: {currentUser.fullname}</Text>
              <Text style={{ color: "white" }}>Email: {currentUser.email}</Text>
            </View>
          ) : (
            <Text style={{ color: "orange" }}>⏳ Loading user data from Convex...</Text>
          )}
        </View>

        {/* All Users */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            All Users in Database ({allUsers?.length || 0}):
          </Text>
          {allUsers ? (
            allUsers.length > 0 ? (
              allUsers.map((user, index) => (
                <View key={user._id} style={{ marginBottom: 10, padding: 10, backgroundColor: "#1A1A1A", borderRadius: 5 }}>
                  <Text style={{ color: "white" }}>#{index + 1}: {user.fullname}</Text>
                  <Text style={{ color: "grey" }}>Email: {user.email}</Text>
                  <Text style={{ color: "grey" }}>Clerk ID: {user.clerkId}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "red" }}>❌ No users found in database</Text>
            )
          ) : (
            <Text style={{ color: "orange" }}>⏳ Loading all users...</Text>
          )}
        </View>

        {/* Debug Info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            Debug Info:
          </Text>
          <Text style={{ color: "white" }}>Signed In: {isSignedIn ? "Yes" : "No"}</Text>
          <Text style={{ color: "white" }}>User Loaded: {user ? "Yes" : "No"}</Text>
          <Text style={{ color: "white" }}>Current User in Convex: {currentUser ? "Yes" : "No"}</Text>
          <Text style={{ color: "white" }}>Total Users in DB: {allUsers?.length || 0}</Text>
        </View>

        <TouchableOpacity 
          onPress={handleManualUserCreation}
          style={{ 
            backgroundColor: "#2DD4BF", 
            padding: 15, 
            borderRadius: 10,
            marginTop: 20 
          }}
        >
          <Text style={{ color: "black", textAlign: "center", fontWeight: "bold" }}>
            🔧 Create User from Clerk Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleTestUserCreation}
          style={{ 
            backgroundColor: "#F59E0B", 
            padding: 15, 
            borderRadius: 10,
            marginTop: 10 
          }}
        >
          <Text style={{ color: "black", textAlign: "center", fontWeight: "bold" }}>
            🧪 Create Test User (No Clerk)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => signOut()}
          style={{ 
            backgroundColor: "#4ADE80", 
            padding: 15, 
            borderRadius: 10,
            marginTop: 10 
          }}
        >
          <Text style={{ color: "black", textAlign: "center", fontWeight: "bold" }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
