# User Journey Map – One-on-One Conversation App (MVP)

---

## 🧑 Persona
**Target User:** Intermediate-level English learner who wants to practice daily with real people via short, focused conversations.

---

## 🔄 Journey Stages

### 1. Visit & Onboarding
- **Action:** User visits the app for the first time
- **UI Elements:** Homepage with "Login with Google" CTA
- **System:** Cognito handles Google OAuth, enforces email verification
- **Outcome:** User is authenticated and redirected to dashboard

### 2. Dashboard View
- **Action:** User sees current status
  - Remaining points (15 daily)
  - Button: “Join Conversation”
- **System:** Reads user state from DynamoDB (`pointsLeft`, `lastSessionTimestamp`)
- **Outcome:** Ready to join queue

### 3. Joining Matchmaking Queue
- **Action:** User clicks “Join Conversation”
- **UI:** Button shows “Searching for a partner…”
- **System:**
  - Lambda publishes message to SNS FIFO
  - SNS forwards to SQS FIFO (matchmaking queue)
  - Matchmaker Lambda checks for available partner
- **Outcome:**
  - If matched → session starts
  - If waiting → polling or WebSocket keeps user informed

### 4. In-Call Experience
- **Action:** Video call starts with matched partner (LiveKit room)
- **UI:**
  - Timer countdown (15 minutes max)
  - “Leave” button
- **System:**
  - JWT token grants room access
  - Points decremented during session
- **Outcome:** Session logged

### 5. Session End
- **Trigger:** Call ends or timer expires
- **UI:** “You spoke for 12 minutes” summary
- **System:**
  - Session record saved
  - Points adjusted
  - Lock if points = 0
- **Outcome:** User returns to dashboard

### 6. Daily Reset
- **Trigger:** 24h after last session or fixed time (UTC)
- **System:**
  - Lambda or frontend detects reset
  - Replenish points
- **Outcome:** User can join again

---
