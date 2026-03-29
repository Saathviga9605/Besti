# 🆘 Besti Troubleshooting & FAQ

Complete guide to solving common issues and answering frequent questions.

---

## ⚡ Quick Fixes

### Issue: "Backend not connecting"
**Quick Fix:**
1. Terminal 1: `cd backend && python main.py`
2. Check: http://localhost:8000 (should show `{"message": "Besti API is running"}`)
3. If error, check OpenAI API key in `.env`

### Issue: "Frontend won't start"
**Quick Fix:**
1. Terminal 2: `cd frontend && npm run dev`
2. Check: http://localhost:3000 (should show Besti app)
3. If error, try: `npm install` again

### Issue: "Can't send messages"
**Quick Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab to see if request goes through
4. Ensure backend is still running

### Issue: "No response from AI"
**Quick Fix:**
1. Check OpenAI API key is correct
2. Verify account has credits (check https://platform.openai.com/account/billing/overview)
3. Restart backend: `python main.py`

---

## 🔧 Detailed Troubleshooting

### ❌ Backend Issues

#### Problem: "ModuleNotFoundError: No module named 'fastapi'"

**Cause:** Virtual environment not activated or packages not installed

**Solution:**
```bash
# Windows:
cd backend
venv\Scripts\activate
pip install -r requirements.txt

# Mac/Linux:
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

---

#### Problem: "OpenAI API Error: Invalid API Key"

**Cause:** `.env` file missing or API key wrong

**Solution:**
1. Verify `.env` file exists in `backend/` directory
2. Check API key at https://platform.openai.com/api-keys
3. Copy exact key to `.env`:
   ```
   OPENAI_API_KEY=sk-proj-...
   ```
4. Restart backend: `python main.py`

---

#### Problem: "Port 8000 already in use"

**Cause:** Another process using port 8000

**Solution (Windows):**
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Solution (Mac/Linux):**
```bash
lsof -i :8000
kill -9 <PID>
```

Or change port in `backend/.env`:
```
PORT=8001
```

---

#### Problem: "CORS error: localhost:3000 not allowed"

**Cause:** CORS not properly configured

**Solution:**
The backend already has CORS enabled. If still failing:

Edit `backend/main.py` and change:
```python
allow_origins=["*"]  # Keep for development
```

For production, be specific:
```python
allow_origins=["http://localhost:3000", "https://yourdomain.com"]
```

---

### ❌ Frontend Issues

#### Problem: "npm: command not found"

**Cause:** Node.js not installed

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install it (includes npm)
3. Verify: `node --version` and `npm --version`
4. Try again: `npm install`

---

#### Problem: "Dependencies won't install (npm install fails)"

**Cause:** npm cache corrupted or network issue

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove old packages
rm -rf node_modules
rm package-lock.json

# Try again
npm install

# Still failing? Try yarn
npm install -g yarn
yarn install
```

---

#### Problem: "Styles not loading (UI looks broken)"

**Cause:** Tailwind CSS not compiled

**Solution:**
```bash
# The dev server should auto-compile
# But try:
npm run build

# Then:
npm run preview
```

Or check that `vite.config.js` has Tailwind plugin:
```javascript
import tailwindcss from 'tailwindcss'
```

---

#### Problem: "Cannot POST /chat (404 error)"

**Cause:** Backend not running or wrong API URL

**Solution:**
1. Check backend is running: http://localhost:8000
2. Check frontend `.env.local` has correct URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```
3. Restart frontend: `npm run dev`

---

#### Problem: "Chat input won't send messages"

**Cause:** Frontend-backend connection problem

**Debug Steps:**
1. Open DevTools (F12)
2. Go to Console tab
3. Send a message
4. Look for JavaScript errors
5. Go to Network tab, filter XHR
6. Send message again
7. Look at request/response details

---

### ❌ Chat & AI Issues

#### Problem: "AI always gives same response"

**Cause:** May be intended or caching issue

**Solution:**
1. Try different message topics
2. Change personality settings
3. Clear browser cache: Ctrl+Shift+Delete
4. Start new chat (not continuing old one)

---

#### Problem: "Chat history not saving"

**Cause:** localStorage disabled or full

**Solution:**
1. Check localStorage is enabled:
   - DevTools (F12) → Application → Storage
   - localStorage should be listed
2. Clear localStorage if full:
   ```javascript
   // In DevTools Console:
   localStorage.clear()
   ```
3. Reload page

---

#### Problem: "Personality settings not working"

**Cause:** Changes not saved or cached

**Solution:**
1. Save in settings modal
2. Reload page
3. Check DevTools → Application → localStorage
4. Should see saved preferences
5. Clear cache: Ctrl+Shift+Delete

---

#### Problem: "Messages keep getting cut off"

**Cause:** Token limit reached

**Solution:**
- Max response is ~300 tokens
- To see full response:
  1. Continue conversation (ask "tell me more")
  2. Start new chat with same context
  3. Change response style to "Short" in settings

---

## ❓ Frequently Asked Questions

### General

**Q: Why do I need an OpenAI API key?**
A: Besti uses GPT-4 for AI responses. You can get a free trial from OpenAI.

**Q: What if I don't have an API key?**
A: Sign up at https://platform.openai.com/, add payment method, and you get credits.

**Q: How much does it cost?**
A: Free tier gets $5 credits. Then pay-as-you-go (~$0.0015 per message).

**Q: Can I use this without internet?**
A: No, OpenAI API requires internet connection. Frontend works offline but can't send messages.

---

### Setup & Installation

**Q: Can I run on localhost only?**
A: Yes, that's the default. Modify `vite.config.js` and `main.py` to expose publicly.

**Q: Do I need to install both backend and frontend?**
A: Yes, both are required. Frontend is UI, backend is AI engine.

**Q: Can I skip the virtual environment?**
A: Not recommended. It keeps dependencies isolated.

**Q: How long does setup take?**
A: 5-10 minutes with good internet.

---

### Features

**Q: Can I have multiple AI personalities?**
A: Yes! Create new chats and give each different settings.

**Q: Does the AI remember me between sessions?**
A: Yes, within same chat. Chat history saved locally. Resets between different chats.

**Q: Can I export conversations?**
A: Currently saved in browser only. Future: export as JSON/PDF.

**Q: What's the max message length?**
A: UI limit is ~2000 chars. API limit is based on tokens.

**Q: Can I use different AI models?**
A: Currently hardcoded to `gpt-4-turbo-preview`. Edit `backend/services.py` to change.

---

### Performance

**Q: Why is response slow?**
A: OpenAI API calls take 2-5 seconds. Network connection matters.

**Q: Can I speed it up?**
A: 1. Use wired internet
2. Shorter prompts = faster responses
3. Reduce context window in services.py

**Q: What if browser tabs are slow?**
A: Each message creates animation overhead. Close other tabs.

---

### Data & Privacy

**Q: Where is my data stored?**
A: Locally in browser + on your computer. No cloud by default.

**Q: Is my data safe?**
A: OpenAI gets message content for processing. Check their privacy policy.

**Q: How do I delete my data?**
A: Browser storage: DevTools → Storage → Clear
Chat history: Click "Clear Chat" or localStorage.clear()

**Q: Can I backup conversations?**
A: Not built-in yet. Check browser storage export options.

---

### Customization

**Q: How do I change the AI name?**
A: Settings modal (⚙️) → Change "AI Name" field → Save

**Q: How do I change the UI colors?**
A: Edit `frontend/tailwind.config.js` → change `colors.primary` and `secondary`

**Q: How do I add a new personality tone?**
A: Edit `backend/services.py` → `tones` dictionary

**Q: Can I use a different AI/LLM?**
A: Yes, modify `backend/services.py` to use different API

---

### Deployment

**Q: Can I deploy to Heroku?**
A: Yes, but need paid dyno (~$7/month)

**Q: Can I deploy to AWS?**
A: Yes, EC2 instance + environment setup required

**Q: How do I make it publicly accessible?**
A: 1. Deploy both backend and frontend
2. Update CORS in backend
3. Update API URL in frontend
4. Set up domain/SSL

---

## 🔍 Debugging Tips

### Enable Debug Logging

**Backend:**
1. Edit `backend/main.py`
2. Add: `import logging; logging.basicConfig(level=logging.DEBUG)`
3. All API calls will be logged

**Frontend:**
1. Open DevTools (F12)
2. Console tab shows all logs
3. Network tab shows HTTP requests

### Check Environment Variables

**Backend:**
```python
import os
print(os.getenv("OPENAI_API_KEY"))
```

**Frontend:**
```javascript
console.log(import.meta.env.VITE_API_URL)
```

### Test API Directly

Using curl (command line):
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "message": "Hello"
  }'
```

Using Postman (GUI):
1. Import collection or create request
2. POST to http://localhost:8000/chat
3. Set body as raw JSON
4. Send and check response

---

## 🆘 Still Stuck?

**Check in this order:**
1. ✅ Is backend running? (http://localhost:8000)
2. ✅ Is frontend running? (http://localhost:3000)
3. ✅ Is `.env` file created with API key?
4. ✅ Open DevTools (F12) and check for errors
5. ✅ Try restarting both servers
6. ✅ Try clearing browser cache
7. ✅ Read error message carefully
8. ✅ Search error in this document

**Last resort:**
1. Delete `venv` and `node_modules`
2. Delete all `.env.local` files
3. Run setup scripts again from scratch

---

## 📋 Checklist Before Asking for Help

- [ ] Backend running: `python main.py`
- [ ] Frontend running: `npm run dev`
- [ ] API key in `backend/.env`
- [ ] Checked DevTools Console (F12)
- [ ] Checked Network tab
- [ ] Restarted servers
- [ ] Cleared browser cache
- [ ] Tried new chat
- [ ] Verified Python/Node.js versions
- [ ] Checked internet connection

If all checked and still stuck, provide:
1. Error message (word-for-word)
2. Which step you're on (setup/running/using)
3. Your OS (Windows/Mac/Linux)
4. DevTools console output

---

## 🎯 Common Error Messages Explained

| Error | Meaning | Fix |
|-------|---------|-----|
| `OPENAI_API_KEY not configured` | API key missing | Add to `.env` |
| `Port 8000 already in use` | Another app using port | Kill other app or change port |
| `Cannot find module 'fastapi'` | Package not installed | Run `pip install -r requirements.txt` |
| `Cannot POST /chat` | Wrong URL or backend down | Check backend running |
| `SyntaxError: Unexpected token <` | HTML returned instead of JSON | Backend not running |
| `TypeError: Cannot read property 'response'` | API response malformed | Check API endpoint |
| `Uncaught Error: Network Error` | Connection refused | Backend not running |

---

## 📞 Support Resources

1. **Official Docs**
   - README.md - Full documentation
   - QUICK-START.md - Setup guide
   - FEATURES.md - Feature guide
   - TECH-STACK.md - Architecture
   - PROJECT-FILES.md - File reference

2. **External Resources**
   - FastAPI: https://fastapi.tiangolo.com/
   - React: https://react.dev/
   - OpenAI: https://platform.openai.com/docs/
   - Tailwind: https://tailwindcss.com/

3. **Community**
   - GitHub Issues (if on GitHub)
   - Stack Overflow (search similar errors)
   - OpenAI Support (for API issues)

---

## ✨ Pro Tips

1. **Terminal Organization**: Open 3 terminals
   - Terminal 1: Backend
   - Terminal 2: Frontend  
   - Terminal 3: Git/Utils

2. **Hot Reload**: Both servers support hot reload
   - Edit code, save
   - Changes appear instantly (usually)

3. **API Testing**: Use Postman to test backend without frontend

4. **DevTools Master**: F12 is your best friend
   - Console for errors
   - Network for requests
   - Application for storage

5. **Search Smart**: Ctrl+F in DevTools helps find messages

---

## 🎉 Success Indicators

✅ Everything working when:
- [ ] http://localhost:3000 loads without errors
- [ ] Can type and send messages
- [ ] Get responses (not errors)
- [ ] Settings modal opens
- [ ] Chat history persists
- [ ] UI looks beautiful with colors/gradients

If all above work → **🎊 Besti is ready!**

---

Have more questions? Check the relevant documentation file! 📚

