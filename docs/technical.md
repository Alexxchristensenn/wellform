Technical Specifications

Core Stack

Runtime: Expo SDK 50+ (Managed Workflow).

Language: TypeScript.

Router: expo-router (File-based routing).

Styling: nativewind (Tailwind CSS) + react-native-reanimated (Complex animations).

Critical Libraries

State/Cache: @tanstack/react-query (Server state), zustand (Client state/Auth).

Auth: firebase/auth, expo-apple-authentication.

Database: firebase/firestore (with offline persistence enabled).

AI: openai (Official Node.js library).

Environment Variables (.env)

EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_OPENAI_API_KEY=...


Animation Standards

Holographic Effect: Must use react-native-reanimated with interpolateColor for hue rotation. CSS Keyframes do not work in Native.

Gesture Handling: Use react-native-gesture-handler for sliders to avoid conflicts with OS gestures on iOS.