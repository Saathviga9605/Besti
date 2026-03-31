# Besti - AI Best Friend Chat Application

A full-stack web application featuring an emotionally engaging AI companion with personality customization.

## 🚀 Features

- **Personalized AI Companion**: Chat with Luna (or customize the name)
- **Personality Customization**: Adjust tone, energy, and response style
- **Beautiful Modern UI**: Glassmorphism design with smooth animations
- **Real-time Chat**: Instant responses with typing indicators
- **Chat History**: Persistent conversation history
- **Local Storage**: Preserves user data locally
- **Responsive Design**: Works seamlessly on desktop and mobile

## 📋 Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- OpenAI API key
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

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
PORT=8000
```

Start the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

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
2. **Send Your First Message**: Type in the chat input and press Enter or click Send
3. **Customize Your AI**: Click the ⚙️ Settings button to:
   - Change the AI's name
   - Choose personality tone (Caring, Funny, Sarcastic, Protective, Romantic)
   - Select energy level (Chill, Chaotic, Deep)
   - Pick response style (Short, Medium, Long, Emoji-heavy)
4. **Start New Chats**: Use the "+ New Chat" button to create multiple conversations
5. **Chat History**: Your conversations are saved and persist across sessions

## 📁 Project Structure

```
Besti/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models.py            # Pydantic models
│   ├── services.py          # LLM service & OpenAI integration
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   └── venv/               # Virtual environment (created locally)
│
└── frontend/
    ├── src/
    │   ├── main.jsx          # React entry point
    │   ├── App.jsx           # Main app component
    │   ├── index.css         # Global styles
    │   ├── components/       # React components
    │   │   ├── ChatMessage.jsx
    │   │   ├── MessageList.jsx
    │   │   ├── ChatInput.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── PersonalityModal.jsx
    │   └── services/
    │       └── api.js        # API service (axios)
    ├── package.json          # npm dependencies
    ├── vite.config.js        # Vite configuration
    ├── tailwind.config.js    # Tailwind CSS config
    ├── postcss.config.js     # PostCSS config
    ├── .env.example          # Environment template
    └── index.html            # HTML entry point
```

## 🔌 API Endpoints

### POST `/chat`
Send a message and get AI response

**Request:**
```json
{
  "user_id": "string",
  "message": "string",
  "personality": {
    "tone": "Caring",
    "energy": "Chill",
    "response_style": "Medium"
  }
}
```

**Response:**
```json
{
  "response": "string",
  "ai_name": "Luna"
}
```

### GET `/history/{user_id}`
Get chat history for a user

### POST `/clear/{user_id}`
Clear chat history for a user

### POST `/preferences`
Save user preferences (AI name and personality)

### GET `/preferences/{user_id}`
Get user preferences

## 🎨 Customization

### Change AI Appearance
Edit the avatar gradient colors in `src/components/ChatMessage.jsx` and `src/components/MessageList.jsx`

### Modify System Prompt
Edit the `build_system_prompt()` method in `backend/services.py` to customize AI behavior

### Update Color Scheme
Edit `frontend/tailwind.config.js` to change the primary colors

### Adjust UI Layout
Components are located in `frontend/src/components/` - modify as needed

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running: `python main.py` in the backend directory
- Check that port 8000 is not in use
- Verify OpenAI API key is valid

### API requests failing
- Check browser console (F12) for CORS errors
- Ensure both frontend and backend are running
- Verify API URL in frontend `.env.local`

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Run `npm run build` to rebuild frontend
- Ensure Tailwind CSS is properly configured

### Chat history not saving
- Check browser's localStorage is enabled
- Clear old data: open DevTools → Application → Local Storage → Clear

## 📦 Building for Production

### Backend
```bash
cd backend
# Install gunicorn for production
pip install gunicorn
# Run with gunicorn
gunicorn main:app --workers 4 --bind 0.0.0.0:8000
```

### Frontend
```bash
cd frontend
npm run build
# Built files are in 'dist' directory
# Serve with any static file server
```

## 🔐 Security Notes

- **Never commit `.env` files** - Always add to `.gitignore`
- **Validate OpenAI API usage** to avoid unexpected charges
- **Set CORS properly** in production (don't use '*')
- **Implement rate limiting** for production

## 📝 License

This project is created as an MVP demonstration.

## 💡 Future Enhancements

- Database integration (PostgreSQL/MongoDB) for persistent storage
- User authentication and accounts
- Multiple AI personalities to choose from
- Voice messaging and TTS
- Export conversations
- Dark/light theme toggle
- Real-time multiplayer chat
- Image sharing in chat
- Advanced memory system with semantic search

## 🤝 Support

For issues or questions, check the setup steps above or verify that:
1. Python and Node.js are properly installed
2. OpenAI API key is valid
3. Environment variables are set correctly
4. Both frontend and backend processes are running

Enjoy chatting with Besti! 🌟
