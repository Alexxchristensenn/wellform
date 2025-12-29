# Ad-hoc & Legacy Files

This folder contains temporary scripts, experiments, and legacy prototypes.

## Contents

### Legacy Prototypes (Moved from `prototypes/`)

These are **web-based React prototypes** created during early UI exploration. They are preserved for reference but are **not part of the production app**.

| File | Description | Status |
|------|-------------|--------|
| `SimplifitHome.jsx` | Early home screen concept (web React) | ⚠️ Legacy - contains calorie UI |
| `SimplifitOnboarding.jsx` | Early onboarding flow (web React) | ⚠️ Legacy - contains calorie UI |

**Warning:** These prototypes use:
- Web-specific CSS (not React Native compatible)
- `lucide-react` (we use `lucide-react-native` in production)
- Calorie/macro counting UI (conflicts with current "Biology, Not Magic" philosophy)

Do **not** copy code from these directly. They exist only as historical reference.

---

## Rules for `adhoc/`

1. All files must reference a Ticket ID in a comment header
2. Clean up experiments after the ticket is closed
3. Never import from `adhoc/` in production `app/` code

