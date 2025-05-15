# API Design Document – One-on-One Conversation App (MVP)

---

## 🔐 Authentication
- All routes require valid Cognito JWT token (API Gateway authorizer)
- Access is limited to authenticated users

---

## 📌 Base URL Structure
- Environment: `https://api.example.com`

---

## 📘 Endpoints

### 1. POST /join
- **Purpose:** User initiates matchmaking
- **Auth:** Required
- **Request Body:**
```json
{}
```
- **Response:**
```json
{
  "status": "queued" | "matched",
  "message": "Waiting for partner" | "Matched successfully",
  "sessionId": "abc123" (optional)
}
```

---

### 2. GET /status
- **Purpose:** Get user's point and session status
- **Auth:** Required
- **Response:**
```json
{
  "pointsLeft": 12,
  "canJoin": true,
  "lastSession": "2025-05-15T10:00:00Z"
}
```

---

### 3. POST /leave
- **Purpose:** Cancel matchmaking request
- **Auth:** Required
- **Response:**
```json
{
  "status": "left",
  "message": "You have left the queue"
}
```

---

### 4. GET /token?sessionId=abc123
- **Purpose:** Generate LiveKit JWT for a session
- **Auth:** Required
- **Response:**
```json
{
  "token": "<LiveKit JWT>",
  "roomName": "abc123"
}
```

---

### 5. GET /session-history
- **Purpose:** Get past sessions
- **Auth:** Required
- **Query Params:** `limit`, `fromDate`, `toDate`
- **Response:**
```json
[
  {
    "sessionId": "abc123",
    "partner": "user456",
    "startTime": "2025-05-15T10:00:00Z",
    "duration": 12
  }
]
```

---

## 🧠 Notes
- All responses are JSON
- All endpoints return 401 if not authenticated
- LiveKit token endpoint ensures user is part of the session and has points

---

## ✅ Next Step
Map these endpoints to Lambda functions and implement validation logic.

