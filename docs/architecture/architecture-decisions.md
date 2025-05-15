# Architecture Decision Records (ADRs)

This document tracks key architectural decisions made throughout the development of the One-on-One Conversation App (MVP). Each ADR includes the context, decision, alternatives considered, and rationale.

---

## ADR 001 – Use AWS Cognito for Authentication

**Status:** Accepted
**Date:** 2025-05-15

### Context

We need secure, reliable user authentication with support for third-party login. Google login is required, and we want to avoid handling password security directly.

### Decision

Use **Amazon Cognito User Pools** for authentication with **Google as the identity provider**, and Cognito Identity Pools for temporary AWS credentials.

### Alternatives Considered

* Firebase Auth: more mobile-focused, less AWS-native
* Auth0: powerful but adds external cost and reliance
* Custom JWT auth: less secure and higher maintenance

### Rationale

Cognito integrates natively with AWS, supports OAuth with Google, and provides built-in email verification and JWT issuance. Cost-effective at our scale.

---

## ADR 002 – Use LiveKit for Video Infrastructure

**Status:** Accepted
**Date:** 2025-05-15

### Context

We need scalable, high-quality video calls between 2 users with low latency, using peer-to-peer when possible. We want self-hosting options and secure room-level access.

### Decision

Use **LiveKit** self-hosted on EC2 with TURN for network traversal.

### Alternatives Considered

* AWS Chime SDK: higher cost, proprietary
* Agora: excellent performance, but SaaS-based pricing
* WebRTC native: would require building everything from scratch

### Rationale

LiveKit offers excellent video quality, E2E encryption, open-source licensing, and integrates with our authentication and token logic. It supports autoscaling and TURN.

---

## ADR 003 – Use SNS + SQS FIFO for Matchmaking

**Status:** Accepted
**Date:** 2025-05-15

### Context

We need a queue-based matchmaking system where users can be matched in order of arrival, and messages must be processed exactly once.

### Decision

Use **Amazon SNS FIFO** to publish matchmaking requests, and **SQS FIFO** as a consumer queue for Lambda processing.

### Alternatives Considered

* SQS FIFO alone: works but harder to decouple producers
* DynamoDB polling: not ideal for real-time pairing
* EventBridge: more complex setup for simple pairing flow

### Rationale

SNS → SQS FIFO gives decoupled, ordered message delivery with high throughput and retry support. Easy to trace events and debug failures.

---

## ADR 004 – Use DynamoDB for User and Session State

**Status:** Accepted
**Date:** 2025-05-15

### Context

We need a highly available, low-latency data store to track user session states, points, and history.

### Decision

Use **Amazon DynamoDB** in on-demand mode with TTL for old sessions.

### Alternatives Considered

* Aurora Serverless: more SQL power, higher cost and latency
* RDS Postgres: not serverless, harder to scale
* Firebase Firestore: not AWS-native, external integration needed

### Rationale

DynamoDB fits our read/write access patterns, is serverless, cost-effective, and integrates with IAM and Lambda natively.

---

## Future ADRs To Be Tracked

* Use of CDK vs Terraform
* Error handling strategy for distributed system
* Monitoring and alert thresholds
* Data retention and privacy compliance

