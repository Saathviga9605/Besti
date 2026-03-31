# Besti - AI Best Friend Chat Application

Besti is a full-stack chat app for emotionally intelligent conversations with an AI companion.

## What Is New

Recent features now included in the app:

- Authentication with signup/login and JWT sessions
- Pinned messages with pin/unpin toggle
- Memory View page: "Things I Remember About You"
- Emotional check-ins triggered by message cadence and time gap
- Chat export with format picker (TXT and JSON)
- Avatar generation and personality customization

## Core Features

- Personalized AI companion with configurable tone, energy, and style
- Multi-conversation chat layout with persistent history
- Pinned section in sidebar for important moments
- Memory categories visible to users:
  - Likes
  - Important moments
  - Emotional states
- Export active conversation from sidebar
- Responsive UI for desktop and mobile

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, Vite, Zustand, Framer Motion
- AI: OpenAI via backend service

## Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key

## Setup

### Backend

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

- Windows:

```bash
venv\Scripts\activate
```

- macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` from example and set key:

```bash
copy .env.example .env
# or
cp .env.example .env
```

`.env` example:

```env
OPENAI_API_KEY=your_api_key_here
PORT=8000
```

Start backend:

```bash
python main.py
```

Backend runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
```

Optional env file:

```bash
VITE_API_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Using Besti

1. Sign up or log in.
2. Start a chat from the sidebar.
3. Send messages and receive AI responses.
4. Pin meaningful messages using the pin icon on message hover.
5. Open Memory View from sidebar to see remembered items.
6. Export current chat as TXT or JSON via format picker.

## Emotional Check-In System

Besti can proactively ask check-in prompts such as:

- "How are you feeling today?"
- "Want to talk about anything?"

Trigger logic:

- Message count threshold
- Time gap since last check-in
- User personality check-in frequency setting (hours)

## API Endpoints

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Chat and Preferences

- `POST /chat`
- `GET /history/{user_id}`
- `POST /clear/{user_id}`
- `POST /preferences`
- `GET /preferences/{user_id}`

### Avatar

- `POST /avatar/generate`
- `GET /avatar/{user_id}`

### Pinned Messages

- `POST /pin-message` (auth required)
- `DELETE /pin-message/{message_id}` (auth required)
- `GET /pinned-messages` (auth required)

### Memory

- `GET /memories` (auth required)

## Export Format

### TXT

Includes:

- Conversation metadata
- Chronological messages
- Per-message timestamp and role

### JSON

Includes:

- Conversation object (`id`, `name`, `exported_at`, `message_count`)
- Structured message array with role/content/timestamp

## Project Structure

```text
BESTI/
├── backend/
│   ├── main.py
│   ├── orm.py
│   ├── models.py
│   ├── services.py
│   ├── auth.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── services/api.js
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Troubleshooting

- Backend not reachable:
  - Confirm backend is running on port 8000.
  - Check `.env` and OpenAI API key.
- Frontend API errors:
  - Confirm `VITE_API_URL` points to backend.
  - Verify both servers are running.
- Pinning fails:
  - Ensure you are logged in.
  - Ensure the message exists in persisted chat history.
- Memory View is empty:
  - No memory rows are stored yet for this user.

## Security Notes

- Never commit real `.env` files.
- Restrict CORS origins in production.
- Add rate limits and stronger production auth controls.

## License

Project is provided as an MVP demonstration.
