# 🔧 Besti Technical Stack & Architecture

## 📋 Tech Stack Overview

### Backend
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **Language**: Python 3.8+
- **LLM**: OpenAI GPT-4
- **Config**: python-dotenv 1.0.0
- **Validation**: Pydantic 2.4.2

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3.3.0
- **HTTP Client**: Axios 1.6.0
- **Animations**: Framer Motion 10.16.0
- **Bundler**: PostCSS + Autoprefixer

---

## 🏗️ Architecture

### Backend Architecture

```
FastAPI Application
├── models.py          # Data models (Pydantic)
│   ├── PersonalityConfig
│   ├── Message
│   ├── ChatRequest
│   └── ChatResponse
│
├── services.py        # Business logic
│   └── LLMService
│       ├── build_system_prompt()
│       └── chat()
│
└── main.py           # API endpoints
    ├── POST /chat
    ├── GET /history/{user_id}
    ├── POST /clear/{user_id}
    ├── POST /preferences
    └── GET /preferences/{user_id}
```

**In-Memory Storage:**
- `chat_histories: Dict[str, List[Message]]` - Conversation storage
- `user_preferences: Dict[str, Dict]` - User settings

**Key Features:**
- CORS enabled for frontend communication
- OpenAI API integration with gpt-4-turbo-preview
- Context-aware responses (last 20 messages)
- Personality-driven system prompts

---

### Frontend Architecture

```
React App
├── App.jsx               # State management & logic
│   ├── currentChat
│   ├── currentMessages
│   ├── preferences
│   └── isLoading
│
├── components/
│   ├── Sidebar.jsx
│   │   ├── Chat history list
│   │   ├── New chat button
│   │   └── Settings access
│   │
│   ├── ChatMessage.jsx
│   │   ├── User message (right-aligned)
│   │   └── AI message (left-aligned)
│   │
│   ├── MessageList.jsx
│   │   ├── Auto-scroll on new messages
│   │   ├── Typing indicator
│   │   └── Empty state
│   │
│   ├── ChatInput.jsx
│   │   ├── Multi-line textarea
│   │   ├── Send button
│   │   └── Keyboard handling (Enter to send)
│   │
│   └── PersonalityModal.jsx
│       ├── AI name input
│       ├── Tone selection
│       ├── Energy selection
│       └── Response style selection
│
└── services/
    └── api.js
        ├── sendMessage()
        ├── getHistory()
        ├── clearHistory()
        ├── setPreferences()
        └── getPreferences()
```

**State Management:**
- React hooks (useState, useEffect)
- localStorage for persistence (user_id, chat data)
- Props drilling for component communication

**Key Features:**
- Glassmorphism UI with rounded corners
- Gradient backgrounds and smooth animations
- Responsive design (desktop & mobile)
- Real-time typing indicators
- Auto-scrolling to latest messages

---

## 💾 Data Flow

### Message Flow
```
User Input
    ↓
ChatInput.jsx
    ↓
App.jsx (handleSendMessage)
    ↓
api.js (chatAPI.sendMessage)
    ↓
Axios POST → http://localhost:8000/chat
    ↓
main.py (POST /chat endpoint)
    ↓
services.py (llm_service.chat)
    ↓
OpenAI API Call
    ↓
Response Processing
    ↓
Return to Frontend
    ↓
Update currentMessages state
    ↓
MessageList.jsx renders new message
    ↓
ChatMessage.jsx animated fade-in
```

---

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Pink (#ec4899)
- **Glass**: White/semi-transparent with backdrop blur

### Components
- **Gradient Buttons**: Purple to Pink gradient
- **Avatar Circles**: Different colors for user/AI/AI name
- **Message Bubbles**: Glassmorphism effect
- **Typing Animation**: Three dots pulsing effect
- **Smooth Transitions**: Framer Motion fade-in

### Responsive Breakpoints
- Mobile: Full-width layout
- Desktop: Sidebar (260px) + Chat area
- Tablet: Collapsible sidebar

---

## 🔌 API Contract

### Authentication
None (MVP) - Uses unique user_id from localStorage

### Request Format
```typescript
interface ChatRequest {
  user_id: string;
  message: string;
  personality?: {
    tone: string;      // Caring, Funny, Sarcastic, Protective, Romantic
    energy: string;    // Chill, Chaotic, Deep
    response_style: string; // Short, Medium, Long, Emoji-heavy
  };
}
```

### Response Format
```typescript
interface ChatResponse {
  response: string;
  ai_name: string;
}
```

---

## 🧠 AI Personality System

### Tone Options
- **Caring**: Warm, empathetic, supportive
- **Funny**: Witty, playful, humor-focused
- **Sarcastic**: Clever, edgy, playful
- **Protective**: Caring, guiding, watchful
- **Romantic**: Affectionate, charming, warm

### Energy Options
- **Chill**: Relaxed, laid-back
- **Chaotic**: Energetic, spontaneous
- **Deep**: Meaningful, philosophical

### Response Styles
- **Short**: 1-2 sentences
- **Medium**: 2-4 sentences (balanced)
- **Long**: 5+ sentences (detailed)
- **Emoji-heavy**: Many emojis for expressiveness

---

## 📊 Performance Considerations

### Backend
- Token limit per request: ~300 tokens
- Context window: Last 20 messages
- Temperature: 0.8 (for personality variety)
- Model: gpt-4-turbo-preview

### Frontend
- Virtual scrolling: Built-in with auto-scroll
- Code splitting: Vite handles automatically
- Bundle size: ~180KB gzipped (estimate)

---

## 🔒 Security Notes

### Current Limitations
- No user authentication
- In-memory storage (lost on restart)
- OpenAI API key exposed in backend
- CORS allows all origins

### Recommended for Production
- Implement user authentication (JWT)
- Use PostgreSQL/MongoDB for persistence
- Environment-based API key management
- Restrict CORS to specific domains
- Rate limiting on API endpoints
- API key rotation mechanism

---

## 🚀 Deployment Options

### Heroku
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```

### Vercel (Frontend)
```bash
vercel --prod
```

### AWS EC2
- Backend: Python on t3.micro (free tier)
- Frontend: S3 + CloudFront
- Database: RDS PostgreSQL

### Docker
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

---

## 📈 Scalability Path

1. **Phase 1 (Current)**: In-memory, single instance
2. **Phase 2**: Add database (PostgreSQL)
3. **Phase 3**: Redis caching, load balancing
4. **Phase 4**: Microservices, message queue (RabbitMQ)
5. **Phase 5**: Kubernetes, distributed storage

---

## 🔗 Integration Points

### External Services
- OpenAI API (gpt-4-turbo-preview)
- No other external dependencies

### Future Integrations
- Supabase (Auth + Database)
- Sentry (Error tracking)
- Stripe (Payments)
- Twilio (SMS notifications)

---

## 📝 Code Quality

### Backend
- Type hints with Pydantic
- Docstrings on all functions
- Error handling with try-except
- Clean separation of concerns

### Frontend
- Functional components with hooks
- Prop validation implicit via JSX
- Comments on complex logic
- Modular component structure

---

## 🧪 Testing (Future)

### Backend
```bash
pytest tests/
pytest tests/test_chat.py --cov
```

### Frontend
```bash
npm test
npm run test -- --coverage
```

---

## 📚 File Size Reference

Backend:
- main.py: ~3KB
- services.py: ~3KB
- models.py: ~1KB
- Total: ~7KB

Frontend:
- App.jsx: ~5KB
- components/ (5 files): ~8KB
- services/api.js: ~2KB
- Total: ~15KB

---

## 🎓 Learning Outcomes

This project demonstrates:
- **Full-stack development**: React + FastAPI
- **API design**: RESTful endpoints
- **UI/UX**: Modern glassmorphism design
- **State management**: React hooks
- **API integration**: Axios + async/await
- **Python async**: Uvicorn + async functions
- **LLM integration**: OpenAI API usage
- **Environment management**: .env configuration

---

## 🤖 Future AI Features

- Voice input/output (Web Audio API)
- Image recognition (vision API)
- Sentiment analysis
- Conversation export (PDF/JSON)
- Multi-user collaboration
- Advanced memory (embeddings/Pinecone)
- Retrieval-Augmented Generation (RAG)
- Fine-tuned models

