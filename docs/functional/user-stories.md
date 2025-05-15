# User Stories & Use Cases – One-on-One Conversation App (MVP)

---

## 🎯 Core User Persona
**Name:** Lucas, 26, intermediate English learner, working remotely from Brazil.  
**Goal:** Improve speaking fluency by practicing daily in short, focused sessions.

---

## ✅ User Stories (MVP)

### 1. As a new user,  
**I want to** log in quickly with my Google account,  
**so that** I don’t need to create a new password or account manually.

### 2. As a verified user,  
**I want to** see how many minutes I can speak today,  
**so that** I know whether I can join a session or not.

### 3. As a logged-in user,  
**I want to** join a conversation with another available user,  
**so that** I can practice speaking without needing to find someone manually.

### 4. As a user waiting for a match,  
**I want to** see a loading indicator and cancel if I change my mind,  
**so that** I feel in control and not stuck.

### 5. As a matched user,  
**I want to** enter a video call that automatically ends after my allowed time,  
**so that** I don’t overuse the system and know when my session is over.

### 6. As a returning user,  
**I want to** see how long I spoke in my last session,  
**so that** I can track my progress over time.

---

## 🧠 Edge Cases / Additional Stories (Post-MVP)

### 7. As a user with no available match,  
**I want to** be notified or retried automatically,  
**so that** I don’t have to manually try again.

### 8. As a power user,  
**I want to** purchase extra points,  
**so that** I can continue practicing beyond the free daily limit.

### 9. As a user with a friend,  
**I want to** invite them to a private conversation,  
**so that** we can practice together instead of being matched randomly.

### 10. As a curious learner,  
**I want to** view my weekly or monthly conversation history,  
**so that** I can measure consistency and improvement.

---

## 📌 Use Case Flow Example – "Join a Session"

1. User logs in via Google  
2. Backend verifies email and checks daily point balance  
3. If eligible, user clicks “Join” → enters matchmaking queue  
4. When matched, both users receive LiveKit tokens and enter video room  
5. Call timer counts down from 15 minutes (or remaining points)  
6. Session ends → points deducted → session is logged in database  
7. User is shown a session summary and returned to dashboard

---

## ✅ Next Step
Map these user stories to features and UI screens to validate design coverage.

