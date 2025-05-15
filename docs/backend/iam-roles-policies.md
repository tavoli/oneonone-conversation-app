# IAM Roles & Policies – One-on-One Conversation App (MVP)

---

## 🔐 Purpose
Define secure and minimal IAM roles and policies required to run the backend, matchmaking, token generation, and user session logic using AWS Lambda, Cognito, and other services.

---

## 🧑‍💻 IAM Roles

### 1. Authenticated User Role (via Cognito Identity Pool)
- **Role Name:** Cognito_AuthenticatedUser_Role
- **Assumed By:** Cognito Authenticated Identities
- **Permissions:**
  - Read/write own user record in DynamoDB (`GetItem`, `UpdateItem`)
  - Call API Gateway routes (via frontend)
  - No direct access to LiveKit

---

### 2. Lambda Execution Role (Default)
- **Role Name:** Lambda_Default_ExecutionRole
- **Permissions:**
  - `logs:CreateLogGroup`
  - `logs:CreateLogStream`
  - `logs:PutLogEvents`

---

### 3. Enqueue Lambda Role
- **Lambda:** enqueueUserToQueue
- **Permissions:**
  - `sns:Publish` to `matchmaking.fifo`
  - `dynamodb:GetItem`, `UpdateItem` on `Users` table

---

### 4. Matchmaker Worker Lambda Role
- **Lambda:** matchmakerWorker
- **Permissions:**
  - `sqs:ReceiveMessage`, `sqs:DeleteMessage` from `matchmaking-queue.fifo`
  - `dynamodb:GetItem`, `UpdateItem` on `Users`
  - `dynamodb:PutItem` on `Sessions`

---

### 5. Token Generator Lambda Role
- **Lambda:** generateLiveKitToken
- **Permissions:**
  - `dynamodb:GetItem` on `Users` and `Sessions`
  - `secretsmanager:GetSecretValue` (LiveKit secret)

---

### 6. Daily Points Reset Lambda Role
- **Lambda:** resetDailyPoints
- **Permissions:**
  - `dynamodb:Scan`, `UpdateItem` on `Users`

---

## 🔐 Security Notes
- Use least privilege IAM practices
- Use resource ARNs with conditions
- Store secrets (LiveKit) in Secrets Manager
- Use dev/prod-specific IAM roles

---

## ✅ Next Step
Define these IAM roles and attach them in CDK module configuration.

