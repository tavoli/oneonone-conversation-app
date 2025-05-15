# Session Access Logic – One-on-One Conversation App (MVP)

---

## 🎯 Purpose
Define logic and guardrails to control user access to one-on-one video sessions.

---

## ✅ Preconditions for Access
1. Authenticated via Cognito (valid JWT)
2. Email is verified
3. User has `pointsLeft > 0` in `Users` table
4. User is listed in session record (`userA` or `userB`)
5. Session is still active
6. (Optional) Token not already issued

---

## ❌ Denial Conditions
- Invalid or expired token
- Email not verified
- Insufficient points
- User not in session
- Session ended or not found

---

## 🔄 Access Flow
1. Client requests `/token?sessionId=...` with JWT
2. Lambda validates all preconditions
3. If valid → generate LiveKit JWT and return
4. If invalid → return 403 with error reason

---

## 🔐 Security Rules
- All access gated through Cognito + Lambda
- JWTs are short-lived (≤15 minutes)
- Room names are obfuscated and scoped
- No anonymous or arbitrary room entry

---

## ✅ Next Step
Enforce these checks in the `generateLiveKitToken` Lambda and reflect access status on the frontend.

