# Feature Prioritization – One-on-One Conversation App (MVP)

---

## 🟢 Core MVP Features (Must-Have)
These are essential for the app to function as intended.

| Feature                              | Description                                                  |
|--------------------------------------|--------------------------------------------------------------|
| Google Login via Cognito             | Secure authentication with email verification                |
| Daily Point System                   | 15 minutes/day usage limit per user                          |
| Join Matchmaking Queue               | Button triggers Lambda → SNS → SQS workflow                  |
| Matchmaking Pairing Logic            | Match two users and initiate session                         |
| LiveKit Video Call                   | WebRTC video session with 15-minute timer                    |
| Session Timeout                      | Auto-end session when points run out or max time is reached  |
| DynamoDB User & Session State        | Track points, usage history, and queue status                |
| Session Summary Screen               | Show duration and feedback after call                        |
| Frontend Hosting (S3 + CloudFront)   | SPA hosted securely and served globally                      |
| CloudWatch Monitoring                | Logs and basic health tracking for Lambdas and EC2           |

---

## 🟡 Post-MVP Enhancements (Should-Have)
Important for engagement and scale but not required on day 1.

| Feature                              | Description                                                  |
|--------------------------------------|--------------------------------------------------------------|
| Reminder Notifications               | Email or push reminder for daily practice                    |
| Session History Dashboard            | View past conversations and durations                        |
| Retry Match if Unavailable           | Automatically retry if no match found in X seconds           |
| Session Feedback Collection          | Simple thumbs-up or emoji reaction post-call                 |
| Points Rollover or Streak Bonuses    | Incentivize daily usage with gamification                    |
| Basic Admin View                     | List active users, sessions, metrics                         |

---

## 🔵 Future Features (Nice-to-Have)
Could differentiate the app later.

| Feature                              | Description                                                  |
|--------------------------------------|--------------------------------------------------------------|
| Friend Invite + Private Match        | Invite friend via link or username to practice together      |
| Paid Plan with Extra Points          | Monetization path beyond daily free usage                    |
| Language Proficiency Tags            | Tag yourself by level (A2, B1, etc.) to match by skill       |
| Practice Streak Tracker              | Visual habit formation tool                                  |
| In-app Messaging (Text)              | Lightweight chat alongside video                             |
| Multi-language Support               | UI internationalization (beyond English)                     |

---

## ✅ Next Step
Start with **Core MVP Features** only. Defer everything else until post-launch learning validates usage patterns and needs.

