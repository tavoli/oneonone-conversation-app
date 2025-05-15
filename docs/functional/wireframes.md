# Wireframes and UI Flow – One-on-One Conversation App (MVP)

---

## 🎨 Wireframe Structure (Text Description)

### 1. Landing Page (Public)
```
+-----------------------------+
|       [App Logo]           |
|                             |
|  "Practice English Daily"   |
|                             |
| [Login with Google Button] |
+-----------------------------+
```
- Redirects to Cognito (Google OAuth)
- If authenticated, redirects to dashboard

---

### 2. Dashboard (After Login)
```
+-----------------------------+
| Hello, [User Name]          |
| Points left: 15             |
| Last session: [Time/Date]  |
|                             |
| [Join Conversation Button] |
+-----------------------------+
```
- Shows user's point status and session history preview
- Button initiates matchmaking

---

### 3. Matchmaking State
```
+-----------------------------+
| Finding a match...         |
|                             |
| 🔄 Spinner animation        |
|                             |
|  [Cancel]                  |
+-----------------------------+
```
- Polls for match result or listens to WebSocket event

---

### 4. Video Call Screen
```
+-----------------------------+
| [Remote Video Feed]         |
|                             |
| [Local Video Feed (small)] |
|                             |
| Time left: 12:00            |
| [Leave Call]                |
+-----------------------------+
```
- Integrated with LiveKit React SDK
- Countdown shows time based on points left

---

### 5. Session Summary
```
+-----------------------------+
| "Session Complete!"         |
|                             |
| You spoke for 14 minutes    |
|                             |
| [Back to Dashboard]         |
+-----------------------------+
```
- Shown after call ends or user disconnects

---

## 🔄 UI Flow Summary
1. Visit → Login  
2. Login → Dashboard  
3. Click “Join” → Matchmaking state  
4. Match found → Call screen  
5. Call ends → Session summary  
6. Return to dashboard or logout

---

## 🔜 Future Wireframes (Post-MVP)
- Practice History screen  
- Invite a friend modal  
- Streak tracker and progress bar  
- Feedback form after session

