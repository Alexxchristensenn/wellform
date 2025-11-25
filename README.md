Simplifit

Biology, Not Magic.

Simplifit (wprking title...) is a health application designed to make actionable fitness advice accessible to all. It strips away the toxicity, complexity, and misinformation of the modern fitness industry to provide a scientifically rigorous, approachable foundation for health.

✨ The Vision

Most fitness apps are built for athletes. This one is built for the rest of us.

Accessible Ethereal: A design language that feels like a sanctuary, not a gym. High contrast text, fluid biological animations, and tactile inputs (sliders over keyboards).

Anti-Misinformation: We don't sell detoxes. We teach Caloric Deficit, Protein Leverage, and Progressive Overload in plain English.

The Daily Pulse: A context-aware feed that changes based on the time of day (Morning Wisdom, Day Nourishment, Evening Reflection).

🚀 Key Features

Narrative Onboarding: A gentle, multi-step journey that calculates TDEE using the Mifflin-St Jeor equation without overwhelming the user.

Holographic Rewards: A custom-built react-native-reanimated system that triggers iridescent, liquid animations upon task completion.

AI Nutritional Co-Pilot: Uses OpenAI (gpt-4o-mini) vision capabilities to analyze food quality and macros from a photo, providing empathetic feedback.

Offline-First: Built on Firebase Firestore with persistence enabled, ensuring the app works in the gym or on the go.

🛠 Tech Stack

Framework: React Native (via Expo Managed Workflow)

Language: TypeScript

Styling: Standard StyleSheet with strict Design Tokens (No NativeWind)

Animation: react-native-reanimated (Shared Values, Layout Animations)

Backend: Firebase (Auth & Firestore)

AI Layer: OpenAI API (gpt-4o-mini in JSON Mode)

State Management: @tanstack/react-query (Server State)

📂 Project Structure

We follow the BitGeek / Taskmaster architectural standard:

simplifit/
├── app/                 # Main application code (Expo Router)
├── components/          # Reusable UI primitives & specific views
│   ├── ui/              # Buttons, Backgrounds, Inputs
│   └── onboarding/      # Step-specific logic
├── docs/                # Architecture & Technical Documentation (The Source of Truth)
├── tickets/             # Active Development Tasks (Taskmaster Workflow)
├── services/            # API wrappers (AI, Firebase)
└── types/               # TypeScript Interfaces (Firestore Schema)


🏁 Getting Started

Clone the repository

git clone [https://github.com/yourusername/simplifit.git](https://github.com/yourusername/simplifit.git)
cd simplifit


Install Dependencies

npm install


Environment Setup
Create a .env file in the root directory:

EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_OPENAI_API_KEY=your_key


Run the App

npx expo start

Built by Alex Christewnsen with ❤️ and logic
