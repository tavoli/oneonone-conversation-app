# Infrastructure as Code Plan – One-on-One Conversation App (MVP)

---

## 📦 Tools
- **Preferred Approach:** AWS CDK (TypeScript)
- **Alternative:** Terraform (modular, remote backend with S3 + DynamoDB lock)

---

## 🔧 Module Breakdown (AWS CDK Stack Plan)

### 1. Authentication Stack
- Cognito User Pool (Google Login only)
- Cognito Identity Pool (for federated AWS access)
- IAM roles for authenticated users

### 2. Frontend Hosting Stack
- S3 bucket (static website hosting)
- CloudFront distribution
- SSL certificate (ACM + Route 53 if domain configured)
- CodePipeline (GitHub Source → Build → S3 Deploy)

### 3. Video Infrastructure Stack
- EC2 instance (LiveKit server)
- EC2 instance (TURN server with Coturn)
- Security Groups (UDP 3478, TCP 5349, media ports)
- Auto Scaling Group (optional)
- Elastic IPs for TURN reliability

### 4. Matchmaking & Queue Stack
- SNS FIFO Topic (`matchmaking.fifo`)
- SQS FIFO Queue (`matchmaking-queue.fifo`)
- SNS subscription to SQS
- IAM policies for Lambda to access these resources

### 5. Compute (Lambda) Stack
- Lambda: `enqueueUserToQueue`
- Lambda: `matchmakerWorker`
- Lambda: `generateLiveKitToken`
- Lambda: `resetDailyPoints`
- API Gateway with routes `/join`, `/status`, `/token`

### 6. Data Layer Stack
- DynamoDB Table: `Users`
  - `userId`, `pointsLeft`, `lastSessionTimestamp`, `isWaitingInQueue`
- DynamoDB Table: `Sessions`
  - `sessionId`, `userA`, `userB`, `startTime`, `endTime`, TTL

### 7. Monitoring & Observability Stack
- CloudWatch Log Groups for each Lambda
- CloudWatch Alarms (Lambda errors, EC2 CPU > 80%)
- Optional dashboards: queue depth, session count, etc.

---

## 🔐 Security Best Practices
- Least privilege IAM roles per Lambda
- Cognito authorizer for API Gateway
- Block public access on S3
- Strict EC2 security groups (LiveKit + TURN)

---

## 🚀 Deployment Strategy
- Versioned CDK stacks deployed via CDK Pipelines
- Environments (e.g. `dev`, `prod`) set via context
- Secrets stored in AWS Secrets Manager (e.g., LiveKit secret)

---

## ✅ Next Step
Define your CDK app structure and implement module-by-module.

