# Token Flow Design – One-on-One Conversation App (MVP)

---

## 🎯 Purpose
Securely generate a signed LiveKit token (JWT) that allows a user to join a room only if they are matched, authenticated, and eligible (points > 0).

---

## ✅ Preconditions for Token Issuance
1. User is authenticated via Cognito
2. Email is verified
3. User has `pointsLeft > 0`
4. User is listed in the `Sessions` table under `userA` or `userB`
5. Session is active and recent
6. (Optional) Token not already issued

---

## 🔄 Flow

### Step 1: Frontend Requests Token
- **Endpoint:** `GET /token?sessionId={id}`
- **Headers:** Authorization: Bearer {Cognito JWT}

### Step 2: API Gateway Authorizer
- Verifies token
- Extracts `sub` as `userId`

### Step 3: Lambda `generateLiveKitToken`
- Validates:
  - Is sessionId valid?
  - Is user `userA` or `userB`?
  - Is the session still valid?
  - Does the user have points?
- Generates JWT using LiveKit secret
- Returns:
```json
{
  "token": "<JWT>",
  "roomName": "abc123"
}
```

---

## 🧾 Token Config (LiveKit)
- `identity`: userId
- `room`: sessionId
- `grants`: join, publish, subscribe
- `ttl`: 15 minutes

---

## ❌ Token Denial Scenarios
- Session not found or expired
- User not in session
- No remaining points
- Session already ended

---

## 🔐 Security Notes
- JWT is short-lived
- No token stored on client
- Only generated server-side
- Token restricted to a specific room

---

## ✅ Next Step
Wire this Lambda with Secrets Manager and API Gateway, and validate all guards against the session table.

