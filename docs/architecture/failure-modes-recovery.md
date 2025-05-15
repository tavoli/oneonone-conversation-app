# Failure Modes & Recovery – One-on-One Conversation App (MVP)

---

## 🎯 Purpose
Prepare for system failures with clear strategies to minimize user impact.

---

## 🔴 Cognito Authentication Fails
- **Impact:** User cannot log in
- **Recovery:** Show friendly error, retry later, monitor AWS Health

---

## 🔴 Matchmaking Queue Stalls
- **Impact:** Users stuck waiting
- **Recovery:**
  - CloudWatch alarms on queue depth/message age
  - DLQ for failed Lambda executions
  - Auto-timeout UI with retry option

---

## 🔴 DynamoDB Throttling
- **Impact:** Lag in updating points or sessions
- **Recovery:** Enable on-demand mode, retry with backoff, monitor throttles

---

## 🔴 LiveKit EC2 Crashes
- **Impact:** No video session possible
- **Recovery:** Auto Scaling/Recovery, EC2 health checks, fallback error message

---

## 🔴 Token Generation Fails
- **Impact:** User blocked from room
- **Recovery:** Log errors, return specific status messages, retry if appropriate

---

## 🔴 Lambda Fails
- **Impact:** Session logic breaks
- **Recovery:** Use structured logs, DLQ, alarms, retry logic

---

## 🧪 Recovery Testing
- Simulate:
  - Queue timeout
  - Token rejection
  - EC2 reboot
  - Invalid sessions or exhausted points

---

## ✅ Next Step
Use this playbook to define smoke tests, incident response, and CI/CD preflight validations.

