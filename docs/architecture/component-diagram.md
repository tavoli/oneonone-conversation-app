# Component Diagram – One-on-One Conversation App (MVP)

This diagram represents the high-level system architecture, showing how users interact with the frontend, which services power the backend, and how video calls are handled via LiveKit.

```mermaid
graph TD
  subgraph User
    A[Browser Client]
  end

  subgraph Frontend (S3 + CloudFront)
    B[React App (Vite)]
  end

  subgraph Auth
    C[Cognito User Pool]
    C2[Cognito Identity Pool]
  end

  subgraph Matchmaking
    D[SNS FIFO Topic]
    E[SQS FIFO Queue]
    F[enqueueUserToQueue Lambda]
    G[matchmakerWorker Lambda]
  end

  subgraph LiveKit & Video
    H[EC2: LiveKit Server]
    H2[EC2: TURN Server]
  end

  subgraph Backend APIs
    I[API Gateway]
    J[generateLiveKitToken Lambda]
    K[resetDailyPoints Lambda]
  end

  subgraph Storage
    L[DynamoDB Users Table]
    M[DynamoDB Sessions Table]
    N[AWS Secrets Manager]
  end

  A --> B
  B --> C
  B --> I
  C --> C2
  I --> F
  I --> J
  I --> K

  F --> D
  D --> E
  E --> G
  G --> L
  G --> M

  J --> L
  J --> M
  J --> N

  G --> H
  B --> H
```

---

## 🔍 Summary
- **Frontend** is a static site hosted via S3 and CloudFront
- **Authentication** is handled by Cognito (Google login only)
- **Matchmaking** is powered by SNS → SQS → Lambda pairing logic
- **Video calls** run via self-hosted LiveKit and TURN on EC2
- **Session state** is managed via DynamoDB
- **Tokens & secrets** are issued securely and never exposed on the client

---

## ✅ Next Step
Add Sequence Diagrams or Deployment Diagrams for deeper technical flows.

