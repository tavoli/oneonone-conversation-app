# Architecture Design – One-on-One Conversation App (MVP)

## Project Goal
Enable authenticated users to join a daily one-on-one video conversation limited to 15 minutes per day, using a point-based system (1 minute = 1 point). Users are matched automatically via a matchmaking queue.

---

## Core Architecture Components (AWS)

### 1. Authentication
- **Service:** Amazon Cognito (User Pools + Identity Pools)
- **Login Method:** Google OAuth only
- **Requirements:**
  - Email verification required before use
  - No anonymous access

### 2. Frontend
- **Stack:** React + Vite
- **Hosting:** Amazon S3 (static site) + CloudFront (CDN)
- **CI/CD:** AWS CodePipeline (triggered by GitHub commits)
- **Language:** English only

### 3. Video Engine
- **Service:** LiveKit (self-hosted on AWS EC2)
- **Deployment:**
  - EC2 instance with Docker
  - TURN server (Coturn) on EC2
  - Enforced access via signed JWTs from backend
- **Security:** Only authenticated users can join rooms

### 4. Matchmaking System
- **Workflow:**
  1. User clicks "Join Conversation"
  2. Lambda publishes a message to SNS FIFO Topic
  3. SNS pushes the message to SQS FIFO Queue
  4. Matchmaker Lambda consumes SQS queue, attempts to pair two users
  5. If matched:
     - Creates LiveKit room and tokens
     - Updates session state in DynamoDB
     - Notifies frontend

- **Services Used:**
  - Amazon SNS FIFO (matchmaking.fifo)
  - Amazon SQS FIFO (matchmaking-queue.fifo)
  - AWS Lambda (enqueue, matchmaker, notify)

### 5. User State and Points
- **Database:** DynamoDB
- **User fields stored:**
  - `userId`
  - `pointsLeft`
  - `lastSessionTimestamp`
  - `isWaitingInQueue`

- **Points Logic:**
  - Each session deducts 1 point per minute
  - Users have 15 points per 24-hour window
  - If points are 0, session access is blocked

### 6. Session History
- **Storage:** DynamoDB
- **Retention Policy:** 90 days (with TTL auto-expiry)
- **Fields Stored:**
  - `sessionId`
  - `userA`, `userB`
  - `startTime`, `endTime`
  - `duration`
- **Visualization (future):** Athena or OpenSearch dashboards

### 7. Monitoring & Scaling
- **Monitoring:** Amazon CloudWatch (Lambda logs, EC2 status, API metrics)
- **Scaling:**
  - EC2 Auto Scaling + ELB for LiveKit
  - SQS auto-scaling via Lambda concurrency

### 8. Security
- Cognito Identity Pools used to control access
- IAM roles restrict access to video session join endpoint
- All users must be verified before interacting with matchmaking

---
