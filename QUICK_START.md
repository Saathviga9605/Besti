# Quick Start Guide - Besti 2.0

## Prerequisites

1. **Backend running**: The API server must be running on `http://localhost:8000`
2. **Frontend running**: The React dev server must be running on `http://localhost:5173`
3. **Database**: SQLite file (`besti_dev.db`) will be created automatically

## Setup Steps

### 1. Backend Setup

```bash
cd d:\BESTI\backend

# Install dependencies (if not already done)
pip install -r requirements.txt

# Start the backend server
python -m uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### 2. Frontend Setup (New Terminal)

```bash
cd d:\BESTI\frontend

# Install dependencies (if not already done)
npm install

# Start the dev server
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in XXX ms

➜ Local:   http://localhost:5173/
```

### 3. Test the Application

1. Open `http://localhost:5173` in your browser
2. Sign up with an email and password
3. Send a message:
   - Type: "Hello!"
   - Press Enter or click send
4. **Expected behavior**:
   - Message appears on the right (user message)
   - "Besti is thinking..." appears
   - AI response appears on the left
   - Chat is saved to sidebar

## Debugging - Message Not Appearing

### Check 1: Open Browser Console
Press `F12` and go to **Console** tab. Look for:
- Red errors (❌)
- Yellow warnings
- Blue logs starting with 📤, ✅, ❌

### Check 2: Backend Running?
Open `http://localhost:8000` in browser - should show JSON (not page not found)

### Check 3: Frontend Connecting to Backend?
In browser console, you should see:
```
📤 API Request: POST /chat
✅ API Response: 200 {...}
```

If you see `❌ Response Error: connect ECONNREFUSED`, backend isn't running.

## Typical Error Messages

| Error | Solution |
|-------|----------|
| `Cannot connect to backend on http://localhost:8000` | Start backend with `python -m uvicorn main:app --reload --port 8000` |
| `User ID missing` | Log out and log back in |
| `Empty response from AI` | Backend crashed or Groq API key issue |
| `ModuleNotFoundError: No module named 'jose'` | Run `pip install -r requirements.txt` |

## Testing Features

### Message Editing
1. Send a message
2. Hover over YOUR message (right side)
3. Click ✏️ button
4. Edit text, click Save
5. AI will regenerate response

### Regenerating Response
1. Send a message and get a response
2. Hover over AI message (left side)
3. Click 🔄 button
4. AI regenerates a new response

### View Stored Emails
1. Send 3-4 messages
2. Click 📚 (Memory button) in header
3. Should see stored memories about what you shared

### View Personality
1. Chat for a bit
2. Click 🎭 (Personality button) in header
3. Should see 4 traits evolving based on emotions

## Database

**File location:** `d:\BESTI\backend\besti_dev.db`

To reset everything:
1. Delete `besti_dev.db`
2. Restart backend - new database will be created

## Still Having Issues?

1. Check browser console for errors (Press F12)
2. Check backend terminal for error messages
3. Verify both servers are running:
   - Backend: `http://localhost:8000` (should show JSON)
   - Frontend: `http://localhost:5173` (should show the app)
4. Check that `.env` file exists in backend with `GROQ_API_KEY` set

---

**Module Status:**
- ✅ Database: SQLAlchemy ORM with SQLite
- ✅ Chat: Database-backed conversation persistence
- ✅ Edit/Regenerate: Message editing and regeneration
- ✅ Emotion: Real-time emotion detection
- ✅ Memory: Long-term memory storage
- ✅ Personality: Evolving personality traits
