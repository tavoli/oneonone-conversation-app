# DynamoDB Schema Design – One-on-One Conversation App (MVP)

---

## 🗃️ Table 1: Users
**Purpose:** Stores user state, including points and queue status.

| Field Name             | Type     | Description                              |
|------------------------|----------|------------------------------------------|
| `userId` (PK)          | String   | Cognito sub or UID                       |
| `pointsLeft`           | Number   | Points remaining today (0–15)            |
| `lastSessionTimestamp` | String   | ISO timestamp of last session            |
| `isWaitingInQueue`     | Boolean  | Whether user is in matchmaking queue     |
| `lastQueueEntry`       | String   | Timestamp when joined matchmaking queue  |
| `email` (optional)     | String   | For debugging or admin use               |

**Access Patterns:**
- Retrieve/update user status
- Enforce point usage rules
- Reset points daily

---

## 🗃️ Table 2: Sessions
**Purpose:** Stores session history

| Field Name         | Type     | Description                              |
|--------------------|----------|------------------------------------------|
| `sessionId` (PK)   | String   | Unique session ID                        |
| `userA`            | String   | Participant 1 ID                         |
| `userB`            | String   | Participant 2 ID                         |
| `startTime`        | String   | ISO timestamp for start                  |
| `endTime`          | String   | ISO timestamp for end                    |
| `duration`         | Number   | Minutes spoken                           |
| `roomName`         | String   | LiveKit room name                        |
| `createdAt`        | String   | Record creation time                     |
| `expiresAt` (TTL)  | Number   | UNIX timestamp for TTL cleanup (90 days) |

**Access Patterns:**
- Show session history by user
- Store live session logs
- Clean up with TTL

---

## 🔁 GSI Recommendations

### GSI1 (on Sessions)
- **Index Name:** `UserSessionsIndex`
- **Partition Key:** `userA`
- **Sort Key:** `startTime`

### GSI2 (on Sessions)
- **Partition Key:** `userB`
- **Sort Key:** `startTime`

---

## 🔐 Best Practices
- TTL on `Sessions` table (`expiresAt`)
- On-demand mode for scalability in MVP
- Condition expressions to prevent race conditions

---

## ✅ Next Step
Provision these tables in CDK, attach IAM policies, and validate access via Lambda functions.

