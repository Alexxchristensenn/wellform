# Simplifit: Technical Architecture & PRD

**Vision:** A data-driven, behavior-focused health dashboard. We trade "Calorie Counting" for "Intuitive Precision."

**Design Philosophy:** "Accessible Ethereal" (High contrast, fluid animation, holographic feedback, tactile inputs).

---

## ❌ What We Do NOT Build

Before we define what we build, let's be explicit about what we **reject**:

- **Manual Calorie Databases:** No food search, no barcode scanners, no nutrition label entry.
- **Macro Calculators:** We do not ask users to weigh their chicken breast.
- **Detox Programs:** Your liver works fine.
- **Spot Reduction Features:** "Belly fat burners" violate thermodynamics.

We believe **habits beat numbers**. A user who consistently eats protein at breakfast will outperform a user obsessively logging 1,847 calories.

---

## 1. Core User Journey & The Simplifit Loop

### The Core Loop: Teach → Practice → Weigh → Adjust

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────┐ │
│   │  TEACH   │ -> │ PRACTICE │ -> │  WEIGH   │ -> │ADJUST│ │
│   │ (Learn)  │    │ (Habits) │    │ (Trend)  │    │(Plan)│ │
│   └──────────┘    └──────────┘    └──────────┘    └──────┘ │
│        ^                                              │     │
│        └──────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Onboarding (Anonymous)

1. User enters biometrics (age, sex, height, weight, goal).
2. App calculates TDEE using **Mifflin-St Jeor** equation.
3. Data saved to `users/{uid}` (anonymous auth).
4. **Output:** Personalized calorie target & protein recommendation (display only—we don't ask them to count).

### Phase 2: Account Linking

1. User signs up via Google/Apple.
2. Anonymous data merged to permanent account.
3. Subscription status initialized (`tier: "free"`).

### Phase 3: Daily Pulse (Home Screen)

The home screen answers one question: **"How am I trending?"**

**Data Fetched:**
- User Profile (targets, preferences)
- Today's Behavior Log (or empty state)
- Last 7 days of weight data (for trend line)

**Key UI Elements:**
1. **Weight Trend Card:** Shows EMA trend vs. raw weight. "Your trend is 70.2 kg (down 0.3 this week)."
2. **The Plate Check:** Boolean habit tracker. Did you hit protein at each meal? Did you move? Did you sleep well?
3. **Daily Reflection:** Optional free-text for context ("Felt stressed, ate late").

### Phase 4: The Plate Check (Behavior Logging)

Instead of logging "Grilled Chicken, 4oz, 180 cal," we ask **simple yes/no questions:**

| Behavior              | Type    | Question                                      |
|-----------------------|---------|-----------------------------------------------|
| `hadProteinBreakfast` | Boolean | "Did your breakfast include protein?"         |
| `hadProteinLunch`     | Boolean | "Did your lunch include protein?"             |
| `hadProteinDinner`    | Boolean | "Did your dinner include protein?"            |
| `ateVeggies`          | Boolean | "Did you eat vegetables today?"               |
| `didWorkout`          | Boolean | "Did you exercise today?"                     |
| `sleepQuality`        | 1-5     | "How was your sleep?" (Slider, not keyboard)  |

**Why Booleans?**
- **Lower friction:** Tap vs. Type.
- **Habit formation:** We're training consistency, not precision.
- **Protein Leverage Hypothesis:** High protein = high satiety = natural calorie reduction.

### Phase 5: Weigh-In (The Truth Layer)

- User logs weight (morning, post-bathroom, pre-food).
- App calculates **Exponential Moving Average (EMA)** to smooth daily fluctuations.
- **Formula:** `Trend = (PreviousTrend × 0.9) + (CurrentWeight × 0.1)`
- We show the **trend**, not the raw number. This reduces anxiety from water weight swings.

### Phase 6: Adjust (AI Coaching)

- Weekly check-in powered by OpenAI.
- AI reviews: weight trend, behavior patterns, reflection notes.
- **Output:** 1-2 actionable suggestions (e.g., "Your trend stalled. You hit protein 5/7 days—try for 7/7 this week.").

---

## 2. Data Schema (Firestore)

### Collection: `users` (Document ID: `auth.uid`)

```json
{
  "profile": {
    "displayName": "Alex",
    "units": "imperial",
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
    "tier": "free",
    "expiry": "TIMESTAMP"
  }
}
```

**Note:** `targetCalories` and `targetProtein` are **display-only guidance**. We never ask users to log against these.

---

### Collection: `users/{uid}/days` (Document ID: `YYYY-MM-DD`)

*The primary daily log. Replaces detailed meal entries with high-level behavior tracking.*

```json
{
  "date": "2025-11-25",
  "weight": 70.5,
  "trend": 70.2,
  "behaviors": {
    "hadProteinBreakfast": true,
    "hadProteinLunch": false,
    "hadProteinDinner": true,
    "ateVeggies": true,
    "didWorkout": true,
    "sleepQuality": 4
  },
  "reflection": "Felt hungry today, slept poorly last night."
}
```

**Field Definitions:**

| Field        | Type    | Description                                           |
|--------------|---------|-------------------------------------------------------|
| `date`       | String  | ISO date format (YYYY-MM-DD)                          |
| `weight`     | Number  | Raw scale weight in kg (converted from user's units)  |
| `trend`      | Number  | Calculated EMA, updated on each weight entry          |
| `behaviors`  | Object  | Boolean habit completions + sleep quality (1-5)       |
| `reflection` | String  | Optional free-text for context                        |

---

### Collection: `users/{uid}/weight_logs` (Document ID: `YYYY-MM-DD`)

*Dedicated weight tracking for EMA trend calculation. Kept separate for query efficiency.*

```json
{
  "date": "2025-11-25",
  "weight": 70.5,
  "timestamp": 1732521600000
}
```

**Frontend calculates EMA from last 30 days:**
```
Trend = (PreviousTrend × 0.9) + (CurrentWeight × 0.1)
```

This smooths daily fluctuations (water, sodium, digestion) to show the user's **true trajectory**.

---

## 3. AI Integration (OpenAI)

**Model:** `gpt-4o-mini` (Cost-effective, vision-capable).

### Weekly Coach Prompt

```
You are Simplifit, a supportive health coach grounded in science.

Context:
- User's weight trend: {trendData}
- This week's behaviors: {behaviorsThisWeek}
- User's reflection notes: {reflections}

Rules:
1. Be encouraging but honest. No toxic positivity.
2. Give exactly 1-2 actionable suggestions.
3. Reference biology when relevant (protein satiety, NEAT, sleep hormones).
4. Keep response under 100 words.

Example output: "Your trend dropped 0.2kg this week—nice work. You hit protein at breakfast 5/7 days. To accelerate, aim for 7/7. Protein in the morning boosts satiety hormones (GLP-1) and reduces afternoon cravings."
```

### Future: Plate Photo Analysis

*If we add camera features, they will be for **education**, not logging.*

```
Analyze this meal photo. Return JSON:
{
  "hasProtein": true,
  "hasVegetables": false,
  "suggestion": "Looks tasty! Adding a side of greens would boost fiber and volume."
}
```

---

## 4. Caching Strategy (TanStack Query)

| Query Key              | Stale Time | Cache Time | Notes                              |
|------------------------|------------|------------|------------------------------------|
| `['user', uid]`        | 5 min      | 30 min     | Profile data, rarely changes       |
| `['day', uid, date]`   | 1 min      | 10 min     | Today's log, updates frequently    |
| `['weightTrend', uid]` | 5 min      | 30 min     | Last 30 days, recalculates daily   |

**Offline First:** Firestore persistence enabled. User can log behaviors offline; syncs when reconnected.

---

## 5. Animation Standards

- **Holographic Effect:** Use `react-native-reanimated` with `interpolateColor` for hue rotation. CSS Keyframes do not work in React Native.
- **Gesture Handling:** Use `react-native-gesture-handler` for sliders to avoid conflicts with iOS system gestures.
- **Micro-interactions:** Haptic feedback on behavior toggles (success = light tap, completion = medium tap).
