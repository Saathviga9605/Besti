# Besti - AI Best Friend Chat Application

A full-stack web application featuring an emotionally engaging AI companion with dynamic avatar generation, user authentication, and persistent chat history.

## 🚀 Features

### Core Features
- **User Authentication**: Secure signup/login with JWT tokens
- **Personalized AI Companion**: Chat with an AI assistant powered by Groq LLM
- **Dynamic Avatar Generation**: Generate unique avatars via DiceBear API with one click
- **Avatar Management**: View, store, and regenerate user avatars
- **Beautiful Modern UI**: Glassmorphism design with smooth animations and aurora color scheme
- **Real-time Chat**: Instant responses from Groq API
- **Chat History**: Persistent conversation history stored in SQLite database
- **Responsive Design**: Mobile-optimized with fixed header/input and scrollable message area
- **Comprehensive Error Handling**: Emoji-prefixed detailed logging for debugging

### Avatar System
- Generate random avatars from DiceBear with customizable styling
- Store avatar preferences in user database
- Fallback to default avatar if generation fails
- One-click regeneration via AvatarPicker modal

### Authentication System
- User signup with email and password
- User login with JWT token authentication
- Secure token validation with detailed error logging
- String-based JWT sub claims for reliability

## 📋 Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- Groq API key (for LLM responses)
- git (optional)

## 🔧 Setup & Installation

### 1. Backend Setup (FastAPI)

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:
- **Windows**:
  ```bash
  venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file by copying `.env.example`:
```bash
copy .env.example .env
# or
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET_KEY=your_secret_key_here
PORT=8000
DATABASE_URL=sqlite:///./besti_dev.db
```

Start the backend server:
```bash
python main.py
```

The backend will initialize the SQLite database automatically and be available at `http://localhost:8000`

You should see: `✅ Database initialized successfully`

### 2. Frontend Setup (React)

In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env.local` file (optional, defaults work):
```bash
VITE_API_URL=http://localhost:8000
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🎮 Using the Application

1. **Open the App**: Visit `http://localhost:3000` in your browser
2. **Sign Up / Login**: 
   - New users: Click "Sign up" and create an account with email and password
   - Existing users: Click "Log in" with your credentials
3. **Generate Your Avatar**:
   - Click the avatar circle in the chat header
   - Click "Generate New Avatar" to create a random unique avatar
   - Your avatar is automatically saved to your profile
4. **Send Your First Message**: Type in the chat input and press Enter or click Send
5. **View Chat History**: All previous messages are saved and persist across sessions
6. **User Features**:
   - Each user has a unique avatar
   - Avatar can be regenerated anytime via the AvatarPicker modal
   - Chat history is tied to your user account

## 📁 Project Structure

```
Besti/
├── backend/
│   ├── main.py              # FastAPI app entry point with all endpoints
│   ├── orm.py               # SQLAlchemy ORM models (User, Avatar, ChatHistory, etc.)
│   ├── models.py            # Pydantic validation schemas
│   ├── auth.py              # JWT token management and password hashing
│   ├── database.py          # SQLAlchemy session and engine setup
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   ├── besti_dev.db          # SQLite database (auto-created)
│   └── venv/               # Virtual environment (created locally)
│
└── frontend/
    ├── src/
    │   ├── main.jsx          # React entry point
    │   ├── App.jsx           # Main app component with auth/chat logic
    │   ├── index.css         # Global styles with scrolling optimization
    │   ├── components/       # React components
    │   │   ├── LoginPage.jsx        # User login component
    │   │   ├── SignupPage.jsx       # User signup component
    │   │   ├── ChatMessage.jsx      # Individual message component
    │   │   ├── MessageList.jsx      # Message list container
    │   │   ├── ChatInput.jsx        # Message input component
    │   │   ├── Sidebar.jsx          # Navigation sidebar
    │   │   └── AvatarPicker.jsx     # Avatar generation/management modal
    │   ├── services/
    │   │   └── api.js               # Axios API service with auth/avatar/chat endpoints
    │   └── styles/
    │       └── avatar-picker.css    # Avatar modal styling
    ├── package.json          # npm dependencies
    ├── vite.config.js        # Vite configuration
    ├── tailwind.config.js    # Tailwind CSS config
    ├── postcss.config.js     # PostCSS config
    ├── .env.example          # Environment template
    └── index.html            # HTML entry point
```

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/auth/signup`
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

#### POST `/auth/login`
Authenticate user and get JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

### Chat Endpoints

#### POST `/chat`
Send a message and get AI response (requires JWT token)

**Request:**
```json
{
  "message": "Hello, how are you?",
  "user_id": 1
}
```

**Response:**
```json
{
  "response": "I'm doing great! How can I help you today?",
  "message_id": 123
}
```

### Avatar Endpoints

#### POST `/avatar/generate`
Generate a new random avatar (requires JWT token)

**Request:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=abc123...",
  "avatar_id": 5,
  "created_at": "2026-03-31T12:00:00"
}
```

#### GET `/avatar/{user_id}`
Retrieve user's current avatar

**Response:**
```json
{
  "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=abc123...",
  "created_at": "2026-03-31T12:00:00",
  "image_type": "avataaars"
}
```

## 🎨 Customization

### Avatar Generation
- Avatars are generated using DiceBear API with random seeds
- Currently uses `avataaars` style (can be changed in `/avatar/generate` endpoint)
- To disable avatar regeneration, comment out the "Generate New Avatar" button in `AvatarPicker.jsx`

### Modify LLM Behavior
Edit the system prompt in `backend/main.py` in the `/chat` endpoint:

```python
messages = [
    {
        "role": "system",
        "content": "You are a helpful, friendly AI assistant..."
    }
]
```

### Update Color Scheme
Edit `frontend/tailwind.config.js` to change the primary colors or modify the aurora theme colors in `index.css`

### Adjust UI Layout
Components are located in `frontend/src/components/` - modify as needed:
- `LoginPage.jsx` - Customize login form appearance
- `SignupPage.jsx` - Customize signup form appearance
- `ChatInput.jsx` - Modify message input bar
- `AvatarPicker.jsx` - Customize avatar modal

### Database Configuration
Edit `DATABASE_URL` in `.env` to use different database:
- SQLite (default): `sqlite:///./besti_dev.db`
- PostgreSQL example: `postgresql://user:password@localhost/besti`

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running: `python main.py` in the backend directory
- Check that port 8000 is not in use
- Verify Groq API key is valid in `.env`
- Look for database initialization message: `✅ Database initialized successfully`

### Avatar generation failing
- Check that you have valid internet connection (DiceBear API required)
- Check backend logs for emoji-prefixed error messages (🎨, ❌, 📭)
- Verify Groq API key is set (though avatar generation uses DiceBear, not Groq)
- Fallback avatar will be used if generation fails

### JWT token validation errors
- Ensure token has string-based "sub" claim
- Check that JWT_SECRET_KEY is set in `.env`
- Re-login to get a fresh token if old token is invalid
- Look for "Subject must be a string" errors in backend logs

### Chat not working or empty responses
- Verify Groq API key is valid and has credits
- Check backend terminal for error messages with emoji prefixes
- Ensure you are logged in (JWT token in request headers)
- Try sending a simple test message

### API requests failing
- Check browser console (F12) for CORS errors
- Ensure both frontend and backend are running
- Verify API URL in frontend `.env.local` matches backend URL
- Check that auth token is being sent in requests

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Run `npm run build` to rebuild frontend
- Ensure Tailwind CSS is properly configured
- Check that avatar-picker.css is imported in components

### Chat scrolling not working correctly
- Ensure `.message-stream` has `overflow-y: auto` in `index.css`
- Check that `.app-shell` has `overflow: hidden` and `position: fixed`
- The header and input should stay fixed while only messages scroll
- If full-page scrolls, revert `.app-shell` and `.chat-shell` to fixed positioning

### Database errors
- Delete `besti_dev.db` to reset database
- Backend will recreate it on next startup
- Ensure `DATABASE_URL` environment variable is correct
- Check that you have write permissions in the backend directory

## 📦 Building for Production

### Backend
```bash
cd backend

# Install production dependencies
pip install gunicorn

# Run with gunicorn (4 workers recommended)
gunicorn main:app --workers 4 --bind 0.0.0.0:8000 --access-logfile - --error-logfile -

# Or use uvicorn with more workers
pip install uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

For production, also:
- Set `DATABASE_URL` to PostgreSQL or other production database
- Set `JWT_SECRET_KEY` to a strong, random key
- Enable CORS only for your frontend domain
- Use HTTPS for all connections

### Frontend
```bash
cd frontend

# Build optimized bundle
npm run build

# Built files are in 'dist' directory
# Serve with any static file server (nginx, Apache, Vercel, Netlify, etc.)

# Example with Python SimpleHTTPServer
cd dist
python -m http.server 3000
```

For production, also:
- Set `VITE_API_URL` to your production backend URL
- Enable minification (default with `npm run build`)
- Configure CORS headers on your server
- Consider CDN for static assets

## 🔐 Security Notes

- **Never commit `.env` files** - Always add to `.gitignore` (already included)
- **JWT_SECRET_KEY**: Use a strong, random key in production. Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- **GROQ_API_KEY**: Keep your Groq API key private. Rotate if compromised. Monitor usage to prevent unexpected charges
- **Password Hashing**: Uses `passlib` with bcrypt for secure password storage (no plaintext passwords)
- **CORS Configuration**: Set to specific frontend domain in production (not '*')
- **Implement rate limiting** on authentication endpoints for production
- **Database credentials**: If using PostgreSQL, use environment variables, not hardcoded credentials
- **HTTPS**: Use HTTPS only in production for all API calls
- **Token expiration**: Consider implementing token expiration/refresh tokens in future
- **Input validation**: All endpoints validate input using Pydantic models
- **SQL injection protection**: Using SQLAlchemy ORM prevents SQL injection

## 📝 License

This project is created as an MVP demonstration.

## 💡 Implemented Features

✅ **Completed:**
- User authentication with JWT tokens
- Avatar generation via DiceBear API
- Avatar storage and retrieval
- SQLite database with persistent storage
- Chat history persistence
- Groq LLM integration
- Beautiful glassmorphism UI
- Responsive mobile design
- Fixed header/input with scrollable message area
- Comprehensive error handling with detailed logging
- Avatar generation modal with UI
- Login/signup pages with scrolling support

## 🔮 Future Enhancements

- **Avatar Upload**: Allow users to upload custom avatar images
- **Avatar Customization**: Advanced DiceBear options (style, colors, accessories)
- **User Profile Page**: Display user info, avatar, statistics
- **Multiple AI Personalities**: Choose different AI characters/personalities
- **Voice Messaging**: Audio input and text-to-speech responses
- **Export Conversations**: Download chat history as PDF or JSON
- **Dark/Light Theme Toggle**: User preference for app appearance
- **Message Search**: Search through chat history
- **Real-time Multiplayer**: Chat with multiple users simultaneously
- **Image Sharing**: Upload and share images in chat
- **Advanced Memory System**: Semantic search and context retention
- **Streaming Responses**: Real-time token streaming from LLM
- **User Statistics**: Track message count, chat duration, etc.
- **Muse 2 EEG Integration**: Real-time brainwave visualization and stress detection (noted in user preferences)
- **SHAP Explainability**: AI Copilot integration with model explanation

## 🤝 Support

For issues or questions, check the setup steps above or verify that:

1. **Python and Node.js** are properly installed:
   ```bash
   python --version  # Should be 3.8+
   node --version    # Should be 16+
   ```

2. **Environment variables** are set correctly:
   - Backend: `.env` file with `GROQ_API_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`, `PORT`
   - Frontend: `.env.local` file with `VITE_API_URL` (optional, defaults to localhost:8000)

3. **Both frontend and backend processes are running**:
   - Backend: `python main.py` (should show database initialization message)
   - Frontend: `npm run dev` (should show Vite dev server URL)

4. **Ports are available**:
   - Backend expects port 8000
   - Frontend expects port 3000 (or next available if 3000 is taken)

5. **API connectivity**:
   - Open DevTools (F12) and check Network tab for failed requests
   - Check backend terminal for emoji-prefixed error messages
   - Look for any 401/403 auth errors or CORS issues

6. **Database**:
   - Check that `besti_dev.db` exists in the backend directory
   - If database issues occur, delete it and restart backend to recreate

## 📚 Technology Stack

- **Backend**: FastAPI, SQLAlchemy ORM, Groq API, Jose (JWT)
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Zustand
- **Database**: SQLite (development), supports PostgreSQL (production)
- **Authentication**: JWT with HS256 algorithm
- **Avatar API**: DiceBear API (no auth required)
- **LLM**: Groq API (requires API key)

## 📄 License

This project is created as an MVP demonstration.

---

**Made with ❤️ - Enjoy chatting with your Besti!** 🌟
