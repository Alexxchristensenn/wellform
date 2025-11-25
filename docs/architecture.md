Simplifit: Technical Architecture & PRD

Vision: A scientifically rigorous, "Grandma-friendly" health app.
Design Philosophy: "Accessible Ethereal" (High contrast, fluid animation, tactile inputs).

1. Core User Journey & Data Flow

Onboarding (Anonymous): User enters data -> Calculated TDEE -> Saved to users/{uid}.

Account Linking: User signs up via Google/Apple -> Anonymous data merged to permanent account.

Daily Pulse (Home):

Fetch: User Profile + Today's Log + Global "Golden Rules".

Cache: React Query handles caching to minimize Firestore reads.

Logging:

Manual: Direct write to users/{uid}/logs/{date}.

AI Camera: Image -> Base64 -> OpenAI API -> JSON -> User Confirmation -> Firestore Write.

2. Data Schema (Firestore)

Collection: users (Document ID: auth.uid)

{
  "profile": {
    "displayName": "Alex",
    "units": "imperial", // "metric" or "imperial"
    "onboardingCompleted": true,
    "createdAt": "TIMESTAMP"
  },
  "stats": {
    "sex": "female",
    "age": 30,
    "heightCm": 170,
    "startWeightKg": 70,
    "currentWeightKg": 69.5,
    "goalWeightKg": 65,
    "activityLevel": 1.2,
    "targetCalories": 1850,
    "targetProtein": 120
  },
  "subscription": {
    "tier": "free", // or "plus"
    "expiry": "TIMESTAMP"
  }
}


Collection: users/{uid}/daily_logs (Document ID: YYYY-MM-DD)

{
  "date": "2025-03-15",
  "calories": 1250,
  "protein": 95,
  "water": 2,
  "steps": 5400,
  "completedRituals": ["hydration", "movement"],
  "completedLesson": true,
  "weightEntry": 69.4, 
  "meals": [
    { "name": "Oatmeal", "cals": 300, "type": "manual" },
    { "name": "Chicken Salad", "cals": 450, "type": "ai_camera" }
  ]
}


3. AI Integration (OpenAI)

Model: gpt-4o-mini (Cost-effective Vision).

Camera Prompt: "You are an empathetic nutritionist. Analyze this food image. Return JSON: { name, cals, macros: {p, c, f}, micros, tip }."

Chat Prompt: "You are Simplifit. Context: {userProfile}. Keep answers under 3 sentences."