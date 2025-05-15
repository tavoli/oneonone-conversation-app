# CloudWatch Monitoring Plan – One-on-One Conversation App (MVP)

---

## 🎯 Objective
Track application health, spot failures, and respond quickly with alerts.

---

## 🔍 Monitoring Targets

### 1. Lambda Functions
- Metrics: Invocations, Errors, Duration, Throttles
- Alarms:
  - Errors ≥ 2/min for 5 min
  - Duration > 2s avg
  - Throttles > 0

### 2. SQS FIFO Queue (matchmaking-queue.fifo)
- Metrics: Number of visible messages, age of oldest message
- Alarms:
  - Depth > 10 for 5 min
  - Message age > 60s

### 3. SNS FIFO Topic
- Metrics: Messages published, notification failures
- Alarm: Any failures > 1 in 5 min

### 4. DynamoDB
- Metrics: ThrottleEvents, ConsumedRead/WriteCapacity
- Alarm: Any throttles

### 5. EC2 (LiveKit + TURN)
- Metrics: CPUUtilization, StatusCheckFailed, NetworkIn/Out
- Alarms:
  - CPU > 80% for 5 min
  - StatusCheckFailed = 1

### 6. API Gateway
- Metrics: 5XXError, 4XXError, Latency
- Alarms:
  - 5XX errors > 5 in 5 min
  - Latency > 1.5s avg

---

## 🛠 Logs
- Log group per Lambda: `/aws/lambda/{function}`
- Retention: 30–90 days
- Use structured JSON logs for:
  - Match failures
  - Token rejections
  - Queue state

---

## 🚨 Alerts
- Route via SNS
- Notify: email for MVP, Slack/PagerDuty in future

---

## ✅ Next Step
Provision these metrics and alarms via CDK or Terraform. Confirm visibility during stress testing.

