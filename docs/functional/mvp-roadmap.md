# MVP Roadmap – One-on-One Conversation App

---

## 🎯 Objective
Deliver a functioning MVP that enables daily 1-on-1 video conversations with automatic matchmaking and point limits.

---

## 🗓️ Timeline: 4–6 Weeks (3–4 hours/day)

### Week 1 – Planning & Setup
- Finalize documentation (✅ done)
- Set up repo & project structure
- Provision: Cognito, S3, DynamoDB (Users & Sessions)
- Scaffold CDK/Terraform project

### Week 2 – Auth & UI
- Integrate Cognito Google login
- Build basic dashboard UI
- Connect dashboard to user status
- Deploy frontend (S3 + CloudFront)

### Week 3 – Matchmaking System
- Set up SNS FIFO → SQS FIFO
- Implement `enqueueUserToQueue` and `matchmakerWorker` Lambdas
- Create `/join` API route
- Frontend state for search/cancel

### Week 4 – Video & Session
- Launch LiveKit on EC2 + TURN server
- Create `/token` endpoint with LiveKit JWT
- Add video interface and countdown
- Save session records and points

### Week 5 – Monitoring & Edge Handling
- Set up CloudWatch logs and alarms
- Write `resetDailyPoints` Lambda
- Add retry/failure UI states
- API: `/status`, `/leave`, `/session-history`

### Week 6 – QA & Polish
- Manual test all flows
- Simulate edge failures (no match, expired points)
- Add session summary screen
- Launch-ready production deploy

---

## ✅ Launch Criteria
- Authenticated user flow working
- Matchmaking functional
- Session starts and ends correctly
- Points deducted and enforced
- DynamoDB records created and queried
- Alarms and metrics set for core services

---

## 🛠 Next Step
Create GitHub issues from this plan and use Projects board for progress tracking.

