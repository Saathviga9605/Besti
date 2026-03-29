# 📂 Besti Project File Guide

Complete reference for all files in the Besti project.

---

## 📋 Root Directory Files

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | 📖 **Main documentation** - Full setup, API, customization, troubleshooting |
| `QUICK-START.md` | 🚀 **Quick guide** - Step-by-step for Windows/Mac/Linux |
| `FEATURES.md` | ✨ **Feature documentation** - All features explained with examples |
| `TECH-STACK.md` | 🔧 **Technical architecture** - Design, components, data flow |
| `PROJECT-FILES.md` | 📂 **This file** - Directory structure and file descriptions |

### Setup Scripts
| File | Purpose |
|------|---------|
| `setup-backend.bat` | 🪟 **Windows backend setup** - Auto-install Python dependencies |
| `setup-backend.sh` | 🐧 **Mac/Linux backend setup** - Auto-install Python dependencies |
| `setup-frontend.bat` | 🪟 **Windows frontend setup** - Auto-install npm dependencies |
| `setup-frontend.sh` | 🐧 **Mac/Linux frontend setup** - Auto-install npm dependencies |
| `start-dev.bat` | ▶️ **Windows starter** - Launch both servers |
| `start-dev.sh` | ▶️ **Mac/Linux starter** - Launch both servers |

### Config Files
| File | Purpose |
|------|---------|
| `.gitignore` | 🚫 Git ignores (venv, node_modules, .env, etc) |

---

## 🐍 Backend Directory (`/backend`)

### Source Code
| File | Size | Purpose |
|------|------|---------|
| `main.py` | 3KB | 🚀 **FastAPI app** - All endpoints, CORS, server setup |
| `services.py` | 3KB | 🧠 **LLM service** - OpenAI integration, personality system |
| `models.py` | 1KB | 📋 **Data models** - Pydantic schemas for requests/responses |

### Configuration
| File | Purpose |
|------|---------|
| `requirements.txt` | 📦 Python dependencies (FastAPI, Uvicorn, OpenAI, etc) |
| `.env.example` | 🔑 **Template** for environment variables |
| `.env` | 🔐 **Created by setup** - Add your OpenAI API key here |

### Auto-Generated
| File | Purpose |
|------|---------|
| `venv/` | 🐍 **Virtual environment** - Created by setup-backend.bat/sh |

### Files Created During Development
```
backend/
├── main.py                 ✅ Core API server
├── services.py             ✅ LLM integration
├── models.py               ✅ Data validation
├── requirements.txt        ✅ Dependencies
├── .env.example            ✅ Config template
├── .env                    ⭕ To be created by user
└── venv/                   ⭕ Created during setup
```

---

## ⚛️ Frontend Directory (`/frontend`)

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | 📦 npm dependencies & scripts (dev, build, preview) |
| `vite.config.js` | ⚙️ Vite bundler config - API proxy to localhost:8000 |
| `tailwind.config.js` | 🎨 Tailwind CSS config - Colors, fonts, animations |
| `postcss.config.js` | 🔗 PostCSS config - Tailwind & autoprefixer |
| `.env.example` | 🔑 Template for environment variables |
| `.env.local` | ⭕ Created by setup - API URL config |
| `index.html` | 📄 HTML entry point - Mounts React app to #root |

### Source Code Structure

#### Root Level

| File | Size | Purpose |
|------|------|---------|
| `src/main.jsx` | 0.5KB | 📍 **Entry point** - Renders React app to DOM |
| `src/App.jsx` | 5KB | 🏠 **Main component** - State management & logic |
| `src/index.css` | 2KB | 🎨 **Global styles** - Tailwind imports, animations, scrollbar |

#### Components (`/src/components`)

| File | Size | Purpose |
|------|------|---------|
| `ChatMessage.jsx` | 1.5KB | 💬 Individual message bubble (user/AI) |
| `MessageList.jsx` | 1.5KB | 📜 Message container with auto-scroll |
| `ChatInput.jsx` | 1.5KB | ⌨️ Input field with auto-expand & send |
| `Sidebar.jsx` | 1.5KB | 📋 Left sidebar - chat history & settings |
| `PersonalityModal.jsx` | 2KB | ⚙️ Settings modal - customize AI personality |

#### Services (`/src/services`)

| File | Size | Purpose |
|------|------|---------|
| `api.js` | 2KB | 🔗 **API client** - Axios methods for all endpoints |

### Directory Tree
```
frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example
├── .env.local                 ⭕ Created by setup
│
├── src/
│   ├── main.jsx              ✅ React entry
│   ├── App.jsx               ✅ Main component
│   ├── index.css             ✅ Global styles
│   │
│   ├── components/           📁 React components
│   │   ├── ChatMessage.jsx
│   │   ├── MessageList.jsx
│   │   ├── ChatInput.jsx
│   │   ├── Sidebar.jsx
│   │   └── PersonalityModal.jsx
│   │
│   └── services/             📁 API layer
│       └── api.js
│
└── node_modules/             ⭕ Created by npm install
```

---

## 📊 File Size Summary

**Backend:**
- main.py: ~3 KB
- services.py: ~3 KB
- models.py: ~1 KB
- **Total Code: ~7 KB**

**Frontend:**
- App.jsx: ~5 KB
- Components (5 files): ~8 KB
- services/api.js: ~2 KB
- **Total Code: ~15 KB**

**Very lightweight! Total code = ~22 KB**

---

## 🔄 Data Flow Between Files

### Message Send Flow
```
React Component (ChatInput.jsx)
    ↓
App.jsx (handleSendMessage)
    ↓
services/api.js (chatAPI.sendMessage)
    ↓
Axios HTTP POST
    ↓
Backend: main.py (POST /chat)
    ↓
services.py (llm_service.chat)
    ↓
OpenAI API
    ↓
Response back to main.py
    ↓
Response to frontend
    ↓
App.jsx updates state
    ↓
MessageList.jsx renders new message
    ↓
ChatMessage.jsx displays with animation
```

---

## ✅ Files Needed Before Running

### Must Have (Created by setup scripts)
- ✅ backend/venv/ - Virtual environment
- ✅ frontend/node_modules/ - npm packages
- ✅ backend/.env - With OpenAI API key
- ✅ frontend/.env.local - API URL config

### Already Provided
- ✅ All source code (.py, .jsx files)
- ✅ All config files
- ✅ package.json, requirements.txt
- ✅ Documentation

---

## 🚀 Key Entry Points

### To Start Backend
```bash
cd backend
python main.py
```
Entry file: `backend/main.py`

### To Start Frontend
```bash
cd frontend
npm run dev
```
Entry file: `frontend/index.html` → `src/main.jsx`

### To Build Frontend
```bash
npm run build
```
Output: `frontend/dist/`

---

## 💾 Configuration Files Explained

### Backend `.env`
```
OPENAI_API_KEY=sk-...        # Your OpenAI API key
PORT=8000                    # Server port
```

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:8000  # Backend URL
```

### Vite Config (`vite.config.js`)
```javascript
server.proxy['/api'] → 'http://localhost:8000'
```
Proxies API calls from frontend to backend

### Tailwind Config
```javascript
colors.primary = '#8b5cf6'   // Purple
colors.secondary = '#ec4899' // Pink
```
Custom color palette

---

## 🎨 Component File Structure

Each React component follows pattern:
```jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ComponentName = ({ props }) => {
  const [state, setState] = useState()
  
  const handleEvent = () => {
    // Logic here
  }
  
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  )
}

export default ComponentName
```

---

## 🐍 Backend Route Structure

Files in `main.py`:
```python
@app.post("/chat")              # Send message
@app.get("/history/{user_id}")  # Get history
@app.post("/clear/{user_id}")   # Clear history
@app.post("/preferences")       # Set preferences
@app.get("/preferences/{user_id}") # Get preferences
```

---

## 📚 What Each File Does (Summary)

### Absolutely Essential
- **App.jsx** - The "brain" managing all state
- **main.py** - The "server" handling requests
- **api.js** - The "messenger" between frontend/backend

### Important Components
- **ChatMessage.jsx** - Displays individual messages
- **ChatInput.jsx** - Where user types
- **MessageList.jsx** - Renders all messages
- **PersonalityModal.jsx** - Settings dialog
- **Sidebar.jsx** - Navigation & history

### Infrastructure
- **services.py** - Talks to OpenAI
- **models.py** - Data validation
- **vite.config.js** - Build setup
- **tailwind.config.js** - Styling config

### Documentation
- **README.md** - Start here
- **QUICK-START.md** - Fastest setup
- **FEATURES.md** - How to use Besti
- **TECH-STACK.md** - Technical deep dive

---

## 🔧 Customization Points

Want to change something? Here are the right files:

| What to Change | Edit File |
|---|---|
| AI personality | `backend/services.py` |
| UI colors | `frontend/tailwind.config.js` |
| Chat layout | `frontend/src/App.jsx` |
| Message styling | `frontend/src/components/ChatMessage.jsx` |
| API endpoints | `backend/main.py` |
| Global styles | `frontend/src/index.css` |
| LLM parameters | `backend/services.py` |
| Frontend build config | `frontend/vite.config.js` |

---

## 📝 Version Control

`.gitignore` excludes:
```
backend/venv/              # Don't commit virtualenv
frontend/node_modules/     # Don't commit npm packages
**/.env                    # Don't commit secrets
**/.env.local             # Don't commit local config
dist/, build/             # Don't commit build output
```

---

## 🎯 Quick File Navigator

**I want to...**
- Add a new API endpoint → Edit `backend/main.py`
- Change the UI layout → Edit `frontend/src/App.jsx`
- Modify message styling → Edit `frontend/src/components/ChatMessage.jsx`
- Add a new React component → Create in `frontend/src/components/`
- Change colors → Edit `frontend/tailwind.config.js`
- Make AI smarter → Edit `backend/services.py`
- Add button behavior → Edit component in `frontend/src/components/`
- Debug backend → Add breakpoints in `backend/main.py`
- Debug frontend → Use browser DevTools (F12)

---

## 📦 Dependencies at a Glance

**Backend:**
- FastAPI - Web framework
- Uvicorn - Server
- OpenAI - LLM API
- Pydantic - Data validation
- python-dotenv - Config management

**Frontend:**
- React - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client
- Framer Motion - Animations

---

## ✨ File Organization Principles

1. **Separation of Concerns**: Different files for different purposes
2. **Modularity**: Components can work independently
3. **Scalability**: Easy to add features without complexity
4. **Maintainability**: Clean code, well-named files
5. **Documentation**: Comments and READMEs in each section

---

## 🎓 Learning Paths

**Want to understand the backend?**
1. Read `backend/main.py` (API structure)
2. Read `backend/services.py` (LLM logic)
3. Read `backend/models.py` (Data types)

**Want to understand the frontend?**
1. Read `frontend/src/App.jsx` (Main logic)
2. Read `frontend/src/components/` (UI pieces)
3. Read `frontend/src/services/api.js` (API calls)

**Want to learn the full flow?**
1. Read `TECH-STACK.md` (Architecture)
2. Trace a message through `App.jsx` → `api.js` → `main.py`
3. Look at files in this guide

---

This is your complete file reference! 📞 Need help? Check the relevant file above.

