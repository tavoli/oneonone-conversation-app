# 🗣️ One-on-One Conversation App (MVP)

A minimal, scalable web app that enables users to engage in **daily 15-minute one-on-one video conversations**, ideal for language practice and casual social interaction. Built on **AWS serverless architecture**, with secure, time-limited access to video rooms using **LiveKit**.

---

## 🌟 Key Features

- ✅ **Google Login (Cognito)** with email verification  
- ✅ **Daily Usage Limit** via a point system (15 minutes/day)  
- ✅ **Automatic Matchmaking** using SNS → SQS FIFO queue  
- ✅ **Secure Video Sessions** via self-hosted LiveKit + TURN  
- ✅ **Session Logging** and point deduction in DynamoDB  
- ✅ **Infrastructure as Code** using AWS CDK  
- ✅ **CloudWatch Monitoring** for all core services  

---

## 🏗️ Project Structure

```bash
oneonone-conversation-app/
├── backend/                    # Lambda function source code
│   ├── functions/
│   │   ├── enqueueUserToQueue/
│   │   ├── matchmakerWorker/
│   │   ├── generateLiveKitToken/
│   │   ├── resetDailyPoints/
│   │   └── shared/
│   ├── api-gateway/
│   └── package.json
│
├── frontend/                   # React frontend (Vite)
│   ├── public/                 # Static assets and favicon
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Routes (e.g. Dashboard, Call)
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # API/Cognito helpers
│   │   ├── styles/             # CSS/Tailwind
│   │   └── main.tsx           # App entry point
│   ├── index.html
│   └── vite.config.ts
│
├── cdk/                        # AWS CDK (infra as code)
│   ├── stacks/
│   └── bin/
│
├── docs/                       # Planning & technical documentation
│   ├── architecture/
│   ├── backend/
│   └── functional/
│
├── README.md
└── .gitignore
```

---

## 🚀 MVP Development Roadmap

| Week | Focus                                 |
|------|----------------------------------------|
| 1    | Project setup, Cognito, DynamoDB       |
| 2    | Frontend auth, dashboard, point state  |
| 3    | Matchmaking logic via SNS/SQS FIFO     |
| 4    | LiveKit integration and session flows  |
| 5    | Monitoring, reset Lambda, edge states  |
| 6    | QA, polish, deployment                 |

📄 [See Full Roadmap →](docs/functional/mvp-roadmap.md)

---

## 🧪 Launch Criteria

- ✅ Authenticated access via Google  
- ✅ Matchmaking and queue flow works  
- ✅ Secure 15-minute video sessions via LiveKit  
- ✅ Points tracked and enforced  
- ✅ Sessions logged in DynamoDB  
- ✅ CloudWatch metrics and alerts set up

---

## ⚙️ Tech Stack

- **Frontend:** React, Vite, hosted on S3 + CloudFront  
- **Backend:** AWS Lambda, API Gateway, Cognito, SQS, SNS  
- **Infra:** AWS CDK (TypeScript)  
- **Video:** LiveKit self-hosted on EC2 + TURN  
- **Storage:** DynamoDB (on-demand)  
- **Monitoring:** CloudWatch + SNS Alerts  

---

## 📦 Requirements

- Node.js / npm  
- AWS CLI with credentials  
- CDK CLI  
- GitHub access (CI optional)

---

## 📜 License

MIT License
