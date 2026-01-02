# 🚀 Major Features Tracking

| ID | Feature | Status | Ticket | MVP? | Notes |
|----|---------|--------|--------|------|-------|
| F-01 | Project Foundation | 🔴 Pending | [SIM-001] | ✅ | StyleSheet, Reanimated, Firebase, OpenAI Setup |
| F-02 | Onboarding Flow | 🔴 Pending | [SIM-002] | ✅ | "Narrative Journey" (Name, Age, Height, Weight) |
| F-03 | The Daily Pulse | 🔴 Pending | [SIM-003] | ✅ | Time-aware Home Screen |
| F-04 | AI Camera (Vision) | 🔴 Pending | [SIM-004] | ✅ | gpt-4o-mini Integration (Premium Feature) |
| F-05 | The Coach (Chat) | 🔴 Pending | [SIM-005] | ❌ | Context-aware LLM Chat |
| F-06 | Auth & Profile | 🔴 Pending | [SIM-006] | ✅ | Apple/Google Sign-in & Data Linking |
| F-14 | Premium Vibe Pass | 🟢 Complete | [SIM-014] | ✅ | Design tokens, motion system, holographic upgrade, micro-delight |
| F-15 | Weekly Insight Engine | 🟢 Complete | [SIM-017] | ✅ | Behavior × Biology synthesis, EMA sparkline, context-aware insights |

Status Legend: 🔴 Pending | 🟡 In Progress | 🟢 Complete | 🧊 Icebox

---

## F-14: Premium Vibe Pass (SIM-014) - Complete

### Deliverables
1. **Design Tokens** (`constants/theme.ts`)
   - Centralized color palette (STONE, ACCENT, HOLOGRAPHIC)
   - Typography scale with Playfair/Manrope fonts
   - Spacing, radii, shadows, button/card tokens

2. **Motion System** (`constants/motion.ts`)
   - Duration scale (micro→ambient)
   - Spring presets (snappy, responsive, gentle, bouncy)
   - Timing presets (fadeIn, slideEnter, shimmer, pulse)
   - Haptic pairing rules

3. **Accessibility** (`hooks/useReducedMotion.ts`)
   - Detects system Reduce Motion setting
   - Provides fallback animation configs
   - Disables shimmer/ambient animations when enabled

4. **Holographic Upgrade** (`components/ui/HolographicCard.tsx`)
   - Subtle vertical drift for "liquid surface" effect
   - Specular highlight sweep on celebration
   - Reduced opacity for calm elegance
   - Respects Reduce Motion

5. **Micro-Delight** (`components/ui/MicroDelight.tsx`)
   - Animated stick-figure weightlifter
   - Triggers on meaningful wins only
   - 2-second auto-dismiss, tap to skip
   - Respects Reduce Motion

6. **QA Polish**
   - All cards use theme tokens
   - Consistent press animations (scale 0.98, spring.snappy)
   - Haptic feedback on interactions
   - Updated `docs/technical.md` with motion spec

---

## F-15: Weekly Insight Engine (SIM-017) - Complete

### Deliverables

1. **useWeeklyReview Hook** (`hooks/useWeeklyReview.ts`)
   - Real-time subscription to `users/{uid}/days` (last 14 days)
   - Real-time subscription to `users/{uid}/weight_logs` (last 14 days)
   - Calculates protein adherence (days with protein hit / 7)
   - Calculates trend delta using EMA (same as `useWeight.ts`)
   - Generates context-aware insight strings based on adherence × trend matrix:
     * High adherence + trend down: "Metabolic gold"
     * High adherence + trend flat: "Body adapting"
     * High adherence + trend up: "Patience required"
     * Low adherence + trend down: "Mixed signals"
     * Low adherence + trend flat: "Opportunity ahead"
     * Low adherence + trend up: "Biology is honest"
   - Returns: `{ loading, stats, trend, history, insight, hasEnoughData }`

2. **WeeklyInsightCard Component** (`components/cards/WeeklyInsightCard.tsx`)
   - Premium "Accessible Ethereal" glassmorphism card
   - SVG sparkline (manual bezier path calculation, no charting libraries)
   - Trend badge with direction indicator (↓ Green, ↑ Red, → Gray)
   - Stats row showing Protein Days & Plants Days counters
   - Centered insight text in a muted background
   - Graceful "Gathering Data" state when < 3 days logged
   - Platform-safe shadows (iOS/Android/Web)

3. **DailyPulseFeed Integration** (`components/home/DailyPulseFeed.tsx`)
   - Calls `useWeeklyReview()` hook
   - Renders `WeeklyInsightCard` above time-of-day card order
   - Only shows when user has ≥1 day of data

4. **Dev Data Utilities** (`services/devData.ts`)
   - `seedWeeklyData()`: Creates 7 days of realistic weight logs + plate checks
   - `seedMinimalData()`: Creates 3 days for testing "Gathering Data" state
   - `clearAllUserData()`: Deletes all weight_logs and day logs
   - All operations log to console for debugging

5. **Profile Dev Tools** (`app/(tabs)/profile.tsx`)
   - Added "Dev Tools (Alpha)" section with 3 buttons
   - **Seed 7-Day Data**: Full weekly insight testing
   - **Seed 3-Day Data**: Minimal data / progression testing
   - **Clear All Data**: Reset to empty state
   - All actions include confirmation dialogs

6. **Testing Documentation** (`DEV_TESTING.md`)
   - Quick start guide for testing flows
   - Insight phrase matrix for verification
   - Visual checklist for card rendering
   - Troubleshooting guide
   - Console output reference

### Test Coverage
- ✅ Math integrity: Uses EMA (not raw weight)
- ✅ Visual polish: Clean spacing, theme tokens, responsive layout
- ✅ Performance: Firestore queries limited to 14 days, SVG in useMemo
- ✅ Accessibility: High contrast, large touch targets, graceful empty state
- ✅ Platform safety: Platform.select for shadows, works on iOS/Android/Web

### Future Enhancement: Insight Voice System

The current insight messages are functional but limited. A future ticket should:

1. **Expand the insight phrase library** - Currently 6 static phrases based on a 2×3 matrix (adherence × trend direction). Should include:
   - Time-based variations (different messages for morning vs evening viewing)
   - Streak-specific messages (first 3-day streak, 7-day streak celebration)
   - Seasonal/contextual phrases (holiday reminders, Monday motivation)
   - Progress milestone messages (first week complete, first kg lost)

2. **Technical format for insight data** (`hooks/useWeeklyReview.ts`):
   ```typescript
   interface InsightContext {
     adherence: number;           // 0-100
     trendDirection: 'up' | 'down' | 'flat';
     streakDays: number;          // Consecutive days logged
     dayOfWeek: number;           // 0=Sunday, 6=Saturday
     timeOfDay: 'morning' | 'day' | 'evening';
     totalDaysTracked: number;    // Lifetime days
     weeklyDelta: number;         // kg change this week
   }
   
   // generateInsight(context: InsightContext) → string
   ```

3. **Content tone guidelines** (per `.cursorrules` persona):
   - Scientific primary: Use correct terminology, cite biology
   - Supportive secondary: No shame, data-driven encouragement
   - Witty tertiary: Intelligent humor, myth-busting where appropriate

4. **AI-powered insights** (future premium feature):
   - Send `InsightContext` to GPT-4o-mini for personalized messages
   - Include user's name and recent behavior patterns
   - Rate-limit to 1 AI insight per day to manage costs

### Known Issues (Out of Scope)
- **Daily Rituals Card**: The hydration/movement rituals card is non-functional (pre-existing, separate ticket needed)
- **Third-party warnings**: `react-native-svg` and `@react-native-community/slider` emit web deprecation warnings (library-level issues)
