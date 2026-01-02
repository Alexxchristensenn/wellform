# SIM-017 Testing Guide

## Quick Start

The **Weekly Insight Card** is now live in the Home tab. Use the dev tools in the **Profile tab** to populate test data.

---

## Testing Flows

### 1. **Empty State → Gathering Data → Full Insight**

**Steps:**
1. Start the app with no data
2. Go to **Profile tab**
3. Tap **"Seed 3-Day Data"** button (📈)
4. Go back to **Home tab**
   - The Weekly Insight Card appears
   - Shows "Keep logging to unlock your weekly insight"
   - Progress indicator: "1 of 3 days logged" (assuming you added logs)
5. Return to Profile, tap **"Seed 7-Day Data"** to top up
6. Go back to Home
   - Full insight text appears
   - Sparkline renders with smooth curve
   - Stats show: "5/7 Protein Days" and "4/7 Plants Days"
   - Trend badge shows delta (e.g., "−0.3 kg")

---

### 2. **Test All Insight Phrases**

The insight text changes based on **Adherence × Trend** matrix:

| Adherence | Trend | Insight |
|-----------|-------|---------|
| High (≥60%) | Down | "Metabolic gold. Your consistency is paying off." |
| High (≥60%) | Flat | "Body adapting. Check sleep and stress." |
| High (≥60%) | Up | "Patience. Biology takes time." |
| Low (<60%) | Down | "Progress despite gaps." |
| Low (<60%) | Flat | "Opportunity ahead. More protein could break this plateau." |
| Low (<60%) | Up | "Biology is honest. Focus on protein." |

**To test different phrases:**
- Seed data multiple times to randomize adherence
- Use `seedWeeklyData()` which has:
  - 80% chance of protein each meal
  - 60% chance of plants each meal
  - Slight downward weight trend (~0.4 kg over 7 days)

---

### 3. **Visual Checks**

When the card is visible, verify:

✅ **Sparkline**
- Renders a smooth curved line (cyan/sky blue)
- Shows 7 data points
- Uses a gradient fill below the line

✅ **Trend Badge**
- Green (↓) if weight went down
- Red (↑) if weight went up
- Gray (→) if flat
- Shows formatted delta (e.g., "−0.3 kg")

✅ **Stats Row**
- Protein Days: "5/7" format
- Plants Days: "4/7" format
- Icons with semantic colors

✅ **Insight Text**
- Clear, non-jargony language
- Centered in a muted background card
- High contrast (dark text on light bg)

✅ **Gathering Data State**
- Yellow/amber dot indicator
- "X of 3 days logged" text
- Shows when < 3 days

---

## Dev Tools Location

**Profile Tab → Scroll Down → Dev Tools (Alpha)**

### Buttons:

1. **📊 Seed 7-Day Data**
   - Creates 7 days of realistic weight logs + plate checks
   - High adherence pattern (5-6 protein hits, 4-5 plants hits)
   - Downward weight trend (~0.4 kg)
   - **Use this for full testing**

2. **📈 Seed 3-Day Data**
   - Creates 3 days of weight logs only (no meal logs)
   - Tests the "Gathering Data" state
   - Useful for progression testing

3. **🗑️ Clear All Data**
   - Deletes all weight_logs and days documents
   - Keeps your profile/stats intact
   - Resets to empty state

---

## Debug Console

All data operations log to the console:

```
[DevData] Seeding data for uid: abc123...
[DevData] Seeded 7 weight logs
[DevData] Seeded 7 day logs
[DevData] ✅ Seeding complete
```

Errors will show as:
```
[DevData] Seeding failed: [error details]
```

---

## Weight Seeding Logic

The `seedWeeklyData()` creates realistic data:

```
Start Weight: 80 kg
Trend Delta: ~0.4 kg / 7 days (downward)
Daily Fluctuation: ±0.3 kg (water weight simulation)

Example data:
Day 1: 80.0 kg
Day 2: 79.9 kg
Day 3: 79.6 kg (dip)
Day 4: 79.8 kg (bounce)
Day 5: 79.5 kg
Day 6: 79.3 kg
Day 7: 79.6 kg (slight rebound)
```

The trend (EMA) smooths these out to show the true ~0.4 kg downward trajectory.

---

## Manual Testing Checklist

- [ ] Seed 7-day data and verify card appears
- [ ] Check sparkline renders without errors
- [ ] Verify trend badge shows correct direction + delta
- [ ] Read insight text — does it match the data?
- [ ] Tap "Clear All Data" and verify card hides
- [ ] Seed 3-day data and verify "Gathering Data" state
- [ ] Close and reopen app — data persists
- [ ] Sign out and back in — data still there
- [ ] Check console for errors
- [ ] Test on iOS, Android, and Web (if available)

---

## Troubleshooting

### Card doesn't appear
- Check console for errors
- Verify `useWeeklyReview` hook is being called
- Check that `users/{uid}/days` and `users/{uid}/weight_logs` are being written to Firestore

### Sparkline shows placeholder
- Less than 2 data points (need at least 2 weight entries)
- Seed more data with Profile buttons

### Insight text says "Keep logging..."
- Less than 3 days of data
- Use "Seed 7-Day Data" button for full insight

### Data doesn't persist after close
- Firebase offline persistence may not be enabled
- Check Firebase initialization in `services/firebase.ts`

---

## Next Steps (After SIM-017)

- [ ] Add visual tests for the sparkline rendering
- [ ] Implement "Reduce Motion" support for animations
- [ ] Create production-ready AI-generated insights (vs. static messages)
- [ ] Build notification/reminder system
- [ ] Add export/sharing of weekly summaries

