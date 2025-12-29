# SIM-DOCS-UPDATE: The "Intuitive Precision" Pivot

## 🎯 OBJECTIVE
Refactor the project documentation (`.cursorrules` and `docs/architecture.md`) to reflect the strategic pivot from "Calorie Tracker" to "Biometric Behavior Dashboard."

## 📝 VIBE & PERSONA UPDATE
**The "Simplifit" Voice:**
1.  **Scientific First (The Anchor):** We deal in biology, thermodynamics, and physics. Never dumb down the truth. Use correct terminology (e.g., "Satiety," "Thermic Effect"), but explain it simply.
2.  **Supportive Second (The Warmth):** We are a sanctuary. No judgment. If the user fails, we offer data, not shame.
3.  **Witty Third (The Spark):** Use dry, intelligent humor. A little wink to the absurdity of the fitness industry. (e.g., "Your liver handles the detox. You just drink the water.")

## 🔄 ARCHITECTURE CHANGES
1.  **The Pivot:** Explicitly state that we **DO NOT** support manual calorie counting databases.
2.  **New Core Loop:** Teach → Practice (Habits) → Weigh → Adjust.
3.  **Schema:** Update the User Schema to focus on `behaviors` (booleans) and `weight_logs` (trends) rather than `meal_entries`.

## 📂 FILES TO OVERWRITE

### 1. `.cursorrules` (The Laws)
*Replace the "Role & Vision" and "Core Philosophy" sections with the new Persona guidelines above.*

### 2. `docs/architecture.md` (The PRD)
*Rewrite Section 1 (Core User Journey) and Section 2 (Data Schema) to remove "Calorie Logging" and insert "The Plate Check" and "Weight Trend."*        